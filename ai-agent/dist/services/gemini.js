"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAgent = void 0;
const generative_ai_1 = require("@google/generative-ai");
const Product_1 = __importDefault(require("../models/Product"));
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const ChatHistory_1 = __importDefault(require("../models/ChatHistory"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Initialize the Google Generative AI client
const getGenAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.warn('WARNING: GEMINI_API_KEY environment variable is not defined.');
    }
    return new generative_ai_1.GoogleGenerativeAI(apiKey || 'MOCK_KEY');
};
// System Prompt for the AI Agent
const SYSTEM_INSTRUCTION = `
You are the official AI Agent of PREMIUMACCOUNTSSTORE.COM (spelled exactly like this).
Your job is to assist customers with:
1. Explaining what subscription services we sell, their plans, features, and rates.
2. Answering general questions about our digital shop, refund policy, support rules.
3. Helping customers check their order status or tracking details.
4. Enabling users to reset their account passwords.
5. Helping users start or complete orders.

Payment Details for the Store:
- bkash (Personal Send Money): 01777553311
- Nagad (Personal Send Money): 01888664422
- Rocket (Personal Send Money): 01999775533
- Upay (Personal Send Money): 01666886644

Ordering Conversational Flow:
1. If a customer wants to buy a plan (e.g., Netflix, Spotify, ChatGPT Premium, Gemini Advanced, Grok, etc.), use the getStoreCatalog tool to review the actual pricing.
2. Ask for their phone number (e.g., '01XXXXXXXXX') to link the order.
3. Call createPendingOrder tool to register a pending order inside our system. It will return an Order ID and the price.
4. Give them our payment number (based on their preferred payment method: bkash, Nagad, etc.) and instruct them to Send Money the exact amount.
5. Once they send money, ask them to reply with the Send Money Sender Phone Number and the Transaction ID (TRX ID).
6. When they provide those details, call the updateOrderPayment tool. Once saved, let them know that their order is now submitted and our admin will verify the payment and deliver their login credentials (Email, Password, PIN) shortly. They can check their order status anytime by providing their Order ID.

Password Reset Flow:
1. If a customer forgot their password, ask for their registered phone number.
2. Call the requestPasswordReset tool. It will generate a temporary 6-digit password and save it.
3. Present the temporary password to the user in the chat and advise them to log in using it and change it inside their profile page immediately.

Speak in a polite, helpful, and premium manner. You can converse in both Bengali and English (or a mix like Banglish) depending on the customer's language. Keep answers concise, clear, and professional. Always use the provided tools for database lookups and actions.
`;
// Define Tool Declarations for Gemini
const tools = [
    {
        functionDeclarations: [
            {
                name: 'getStoreCatalog',
                description: 'Fetch the active list of digital products, subscription plans, pricing, features, and durations from the database catalog.',
                parameters: { type: 'object', properties: {} }
            },
            {
                name: 'trackOrder',
                description: 'Fetch the current status, app/plan details, price, payment info, and credentials (email/password/pin) of a subscription order by its unique Order ID.',
                parameters: {
                    type: 'object',
                    properties: {
                        orderId: { type: 'string', description: 'The unique Order ID to track (e.g. ORD-123456).' }
                    },
                    required: ['orderId']
                }
            },
            {
                name: 'cancelOrder',
                description: 'Cancel a pending subscription order in the database by its Order ID.',
                parameters: {
                    type: 'object',
                    properties: {
                        orderId: { type: 'string', description: 'The unique Order ID to cancel.' }
                    },
                    required: ['orderId']
                }
            },
            {
                name: 'createPendingOrder',
                description: 'Register a pending subscription order in the database for a customer.',
                parameters: {
                    type: 'object',
                    properties: {
                        phone: { type: 'string', description: 'The customer\'s registered phone number (e.g. 01712345678).' },
                        appId: { type: 'string', description: 'The application ID (e.g. chatgpt, netflix, gemini, spotify).' },
                        planName: { type: 'string', description: 'The specific name of the plan (e.g. ChatGPT Plus, Netflix Premium Ultra HD, Spotify Premium Individual, Google AI Plus).' },
                        durationLabel: { type: 'string', description: 'The selected duration label (e.g. 1 Month, 3 Months, 6 Months, 12 Months).' }
                    },
                    required: ['phone', 'appId', 'planName', 'durationLabel']
                }
            },
            {
                name: 'updateOrderPayment',
                description: 'Update a pending order in the database with the customer\'s payment transaction details after they send money.',
                parameters: {
                    type: 'object',
                    properties: {
                        orderId: { type: 'string', description: 'The unique Order ID to update.' },
                        paymentMethod: { type: 'string', description: 'The selected payment method used (e.g. bkash, nagad, rocket, upay).' },
                        transactionId: { type: 'string', description: 'The transaction ID of the send money payment (e.g. TRX99283726).' },
                        senderNumber: { type: 'string', description: 'The sender phone number used to send the money.' }
                    },
                    required: ['orderId', 'paymentMethod', 'transactionId', 'senderNumber']
                }
            },
            {
                name: 'requestPasswordReset',
                description: 'Reset a user\'s account password to a randomly generated temporary password using their registered phone number.',
                parameters: {
                    type: 'object',
                    properties: {
                        phone: { type: 'string', description: 'The registered phone number of the user requesting a reset.' }
                    },
                    required: ['phone']
                }
            }
        ]
    }
];
// Tool Implementation Handlers
const handleGetStoreCatalog = async () => {
    try {
        const products = await Product_1.default.find({});
        return { success: true, products };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleTrackOrder = async (args) => {
    try {
        const order = await Order_1.default.findOne({ orderId: args.orderId });
        if (!order) {
            return { success: false, message: `No order found with ID: ${args.orderId}` };
        }
        return { success: true, order };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleCancelOrder = async (args) => {
    try {
        const order = await Order_1.default.findOne({ orderId: args.orderId });
        if (!order) {
            return { success: false, message: `No order found with ID: ${args.orderId}` };
        }
        if (order.status !== 'Pending') {
            return { success: false, message: `Order status is '${order.status}' and cannot be cancelled.` };
        }
        order.status = 'Cancelled';
        await order.save();
        return { success: true, message: `Order #${args.orderId} has been successfully cancelled.` };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleCreatePendingOrder = async (args) => {
    try {
        // 1. Ensure user exists or create a temporary one
        let user = await User_1.default.findOne({ phone: args.phone });
        if (!user) {
            // Create user with a random password if it doesn't exist
            const tempPass = Math.floor(100000 + Math.random() * 900000).toString();
            const salt = await bcryptjs_1.default.genSalt(10);
            const hashedPassword = await bcryptjs_1.default.hash(tempPass, salt);
            user = await User_1.default.create({
                phone: args.phone,
                password: hashedPassword,
                name: `Customer ${args.phone.slice(-4)}`
            });
        }
        // 2. Fetch product details
        const product = await Product_1.default.findOne({ appId: args.appId });
        if (!product) {
            return { success: false, message: `Product not found with App ID: ${args.appId}` };
        }
        // 3. Find plan
        const plan = product.plans.find(p => p.planName.toLowerCase() === args.planName.toLowerCase() || p.planName.toLowerCase().includes(args.planName.toLowerCase()));
        if (!plan) {
            return { success: false, message: `Plan '${args.planName}' not found. Available plans: ${product.plans.map(p => p.planName).join(', ')}` };
        }
        // 4. Find duration
        const duration = plan.durations.find(d => d.label.toLowerCase() === args.durationLabel.toLowerCase() || d.label.toLowerCase().includes(args.durationLabel.toLowerCase()));
        if (!duration) {
            return { success: false, message: `Duration '${args.durationLabel}' not found. Available: ${plan.durations.map(d => d.label).join(', ')}` };
        }
        // 5. Generate Order ID
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        // 6. Create Pending Order
        const newOrder = await Order_1.default.create({
            orderId,
            userId: user._id,
            appName: product.appName,
            planName: plan.planName,
            duration: duration.label,
            price: duration.price,
            paymentMethod: 'Pending',
            transactionId: 'Pending',
            senderNumber: 'Pending',
            status: 'Pending'
        });
        return {
            success: true,
            orderId: newOrder.orderId,
            price: newOrder.price,
            appName: newOrder.appName,
            planName: newOrder.planName,
            duration: newOrder.duration,
            checkoutUrl: `/orders/${newOrder.orderId}`
        };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleUpdateOrderPayment = async (args) => {
    try {
        const order = await Order_1.default.findOne({ orderId: args.orderId });
        if (!order) {
            return { success: false, message: `No order found with ID: ${args.orderId}` };
        }
        order.paymentMethod = args.paymentMethod;
        order.transactionId = args.transactionId;
        order.senderNumber = args.senderNumber;
        order.status = 'Pending'; // Ensure reset to Pending for admin verification
        await order.save();
        return { success: true, message: `Order #${args.orderId} payment details updated successfully. Pending admin verification.` };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleRequestPasswordReset = async (args) => {
    try {
        const user = await User_1.default.findOne({ phone: args.phone });
        if (!user) {
            return { success: false, message: `No registered user found with phone number: ${args.phone}` };
        }
        const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(tempPassword, salt);
        user.password = hashedPassword;
        await user.save();
        return { success: true, tempPassword, message: `Password reset successfully for ${args.phone}.` };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
// Dispatcher for Tool Execution
const executeTool = async (name, args) => {
    console.log(`AI Agent tool call: ${name}`, args);
    switch (name) {
        case 'getStoreCatalog':
            return await handleGetStoreCatalog();
        case 'trackOrder':
            return await handleTrackOrder(args);
        case 'cancelOrder':
            return await handleCancelOrder(args);
        case 'createPendingOrder':
            return await handleCreatePendingOrder(args);
        case 'updateOrderPayment':
            return await handleUpdateOrderPayment(args);
        case 'requestPasswordReset':
            return await handleRequestPasswordReset(args);
        default:
            throw new Error(`Unknown function: ${name}`);
    }
};
// Main interface to chat with the AI agent
const chatWithAgent = async (sessionId, userMessage) => {
    try {
        // 1. Fetch JID/PSID history from DB
        let historyDoc = await ChatHistory_1.default.findOne({ sessionId });
        if (!historyDoc) {
            historyDoc = new ChatHistory_1.default({ sessionId, messages: [] });
        }
        // Ensure system instruction is attached or formatted in the request
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({
            model: 'gemini-3.5-flash'
        });
        // Translate our database history format to Gemini SDK format
        const sdkHistory = historyDoc.messages.map((m) => ({
            role: m.role,
            parts: m.parts.map((p) => ({ text: p.text }))
        }));
        // Inject system instruction if history is empty
        if (sdkHistory.length === 0) {
            sdkHistory.push({
                role: 'user',
                parts: [{ text: `[SYSTEM INSTRUCTION: ${SYSTEM_INSTRUCTION}]\n\nHello` }]
            });
            sdkHistory.push({
                role: 'model',
                parts: [{ text: 'Understood. How can I help you today?' }]
            });
        }
        // Start a chat session with history and tools
        const chat = model.startChat({
            history: sdkHistory,
            tools: tools
        });
        // Send the user message
        let result = await chat.sendMessage(userMessage);
        // Loop to handle tool/function calls recursively
        let calls = typeof result.functionCalls === 'function' ? result.functionCalls() : result.functionCalls;
        while (calls && calls.length > 0) {
            const toolCall = calls[0];
            const toolResult = await executeTool(toolCall.name, toolCall.args);
            // Send function response back to Gemini to get next output
            result = await chat.sendMessage([
                {
                    functionResponse: {
                        name: toolCall.name,
                        response: toolResult
                    }
                }
            ]);
            calls = typeof result.functionCalls === 'function' ? result.functionCalls() : result.functionCalls;
        }
        // Fetch the final generated text
        const replyText = result.response.text();
        // Save updated history back to MongoDB
        const updatedHistory = await chat.getHistory();
        historyDoc.messages = updatedHistory.map((m) => ({
            role: m.role,
            parts: m.parts.map((p) => ({ text: p.text || '' }))
        }));
        await historyDoc.save();
        return replyText;
    }
    catch (err) {
        console.error('Error in chatWithAgent:', err);
        return `দুঃখিত, বর্তমানে একটি টেকনিক্যাল সমস্যার কারণে আমি আপনার মেসেজটি প্রসেস করতে পারছি না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন। (Error: ${err.message})`;
    }
};
exports.chatWithAgent = chatWithAgent;
