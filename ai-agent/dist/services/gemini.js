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
const prompt_1 = require("./prompt");
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
const chatWithAgent = async (sessionId, userMessage, apiKey) => {
    if (!apiKey) {
        throw new Error("Gemini API key is missing");
    }
    const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
    try {
        // 1. Fetch JID/PSID history from DB
        let historyDoc = await ChatHistory_1.default.findOne({ sessionId });
        if (!historyDoc) {
            historyDoc = new ChatHistory_1.default({ sessionId, messages: [] });
        }
        // Translate our database history format to Gemini SDK format
        const sdkHistory = historyDoc.messages.map((m) => ({
            role: m.role,
            parts: m.parts.map((p) => {
                const cleanPart = {};
                if (p.text !== undefined)
                    cleanPart.text = p.text;
                if (p.functionCall !== undefined)
                    cleanPart.functionCall = p.functionCall;
                if (p.functionResponse !== undefined)
                    cleanPart.functionResponse = p.functionResponse;
                return cleanPart;
            })
        }));
        // Inject system instruction if history is empty
        if (sdkHistory.length === 0) {
            sdkHistory.push({
                role: 'user',
                parts: [{ text: `[SYSTEM INSTRUCTION: ${prompt_1.SYSTEM_INSTRUCTION}]\n\nHello` }]
            });
            sdkHistory.push({
                role: 'model',
                parts: [{ text: 'Understood. How can I help you today?' }]
            });
        }
        // Try models in fallback order
        const GEMINI_MODEL_FALLBACKS = [
            'models/gemini-2.0-flash',
            'models/gemini-2.0-flash-lite',
            'models/gemini-2.5-flash-lite',
            'models/gemini-2.5-flash',
            'models/gemini-flash-latest',
            'models/gemini-pro-latest',
        ];
        let result = null;
        let successfulModel = null;
        let chat = null;
        for (const modelName of GEMINI_MODEL_FALLBACKS) {
            const m = genAI.getGenerativeModel({ model: modelName, tools: [{ functionDeclarations: tools }] });
            chat = m.startChat({ history: sdkHistory });
            try {
                result = await chat.sendMessage(userMessage);
                successfulModel = modelName;
                console.log(`✅ Gemini replied using: ${modelName}`);
                break;
            }
            catch (err) {
                console.warn(`❌ Model ${modelName} failed: ${err.message?.substring(0, 80)}`);
                chat = null;
                result = null;
            }
        }
        if (!result || !chat) {
            return 'দুঃখিত, বর্তমানে AI সার্ভিস উপলব্ধ নেই। আপনার API Key চেক করুন অথবা পরে আবার চেষ্টা করুন।';
        }
        // Loop to handle tool/function calls recursively
        let calls = typeof result.functionCalls === 'function' ? result.functionCalls() : result.functionCalls;
        while (calls && calls.length > 0) {
            const toolCall = calls[0];
            const toolResult = await executeTool(toolCall.name, toolCall.args);
            result = await chat.sendMessage([{ functionResponse: { name: toolCall.name, response: toolResult } }]);
            calls = typeof result.functionCalls === 'function' ? result.functionCalls() : result.functionCalls;
        }
        // Fetch the final generated text
        let replyText = '';
        try {
            replyText = result.response.text();
        }
        catch (err) {
            console.warn("Gemini didn't return text. Falling back.");
        }
        if (!replyText || replyText.trim() === '') {
            replyText = "আমি দুঃখিত, আমি আপনার রিকুয়েস্টটি প্রসেস করতে পারছি না। দয়া করে আবার মেসেজ দিন।";
        }
        // Save updated history back to MongoDB
        const updatedHistory = await chat.getHistory();
        historyDoc.messages = updatedHistory.map((m) => ({
            role: m.role,
            parts: m.parts
        }));
        await historyDoc.save();
        return replyText;
    }
    catch (err) {
        console.error('Error in chatWithAgent (Gemini):', err);
        throw err; // Re-throw to allow AI Manager to catch and fallback
    }
};
exports.chatWithAgent = chatWithAgent;
