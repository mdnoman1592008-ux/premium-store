"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAgent = void 0;
const openai_1 = __importDefault(require("openai"));
const Product_1 = __importDefault(require("../models/Product"));
const Order_1 = __importDefault(require("../models/Order"));
const ChatHistory_1 = __importDefault(require("../models/ChatHistory"));
const prompt_1 = require("./prompt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
// Define Tool Declarations for DeepSeek
const tools = [
    {
        type: "function",
        function: {
            name: 'getStoreCatalog',
            description: 'Fetch the entire store catalog of Premium Accounts BD. Returns a list of apps, pricing, and durations available. Use this whenever the user asks for a price.',
            parameters: {
                type: 'object',
                properties: {},
                required: []
            }
        }
    },
    {
        type: "function",
        function: {
            name: 'createPendingOrder',
            description: 'Create a pending order when a user expresses intent to purchase a subscription. DO NOT CALL THIS unless you have their phone number and they agreed to the price.',
            parameters: {
                type: 'object',
                properties: {
                    customerPhone: { type: 'string', description: 'The phone number of the customer placing the order.' },
                    productName: { type: 'string', description: 'The exact name of the app/product they want.' },
                    duration: { type: 'string', description: 'Duration of the package (e.g., "1 Month", "3 Months", "6 Months", "1 Year", "18 Months").' },
                    price: { type: 'number', description: 'The exact price in BDT. You must get this from the getStoreCatalog tool first.' }
                },
                required: ['customerPhone', 'productName', 'duration', 'price']
            }
        }
    },
    {
        type: "function",
        function: {
            name: 'updateOrderPayment',
            description: 'Save payment details to a pending order after the user has sent money. Requires Order ID, Sender Phone Number, and TrxID.',
            parameters: {
                type: 'object',
                properties: {
                    orderId: { type: 'string', description: 'The unique Order ID generated during createPendingOrder.' },
                    paymentSenderNumber: { type: 'string', description: 'The phone number from which the user sent the money.' },
                    trxId: { type: 'string', description: 'The transaction ID (TrxID) provided by the user.' }
                },
                required: ['orderId', 'paymentSenderNumber', 'trxId']
            }
        }
    },
    {
        type: "function",
        function: {
            name: 'trackOrder',
            description: 'Look up an order status by Order ID. Returns order details including status (Pending, Verified, Delivered).',
            parameters: {
                type: 'object',
                properties: {
                    orderId: { type: 'string', description: 'The Order ID to track.' }
                },
                required: ['orderId']
            }
        }
    },
    {
        type: "function",
        function: {
            name: 'requestPasswordReset',
            description: 'Reset a user\'s account password to a randomly generated temporary password using their registered phone number or email address.',
            parameters: {
                type: 'object',
                properties: {
                    identifier: { type: 'string', description: 'The registered phone number or email address of the user requesting a reset.' }
                },
                required: ['identifier']
            }
        }
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
const handleCreatePendingOrder = async (args) => {
    try {
        const { customerPhone, productName, duration, price } = args;
        const newOrder = new Order_1.default({
            customerPhone,
            productName,
            duration,
            price,
            status: 'Pending',
            orderDate: new Date()
        });
        const saved = await newOrder.save();
        return { success: true, message: 'Order created', orderId: saved._id };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleUpdateOrderPayment = async (args) => {
    try {
        const { orderId, paymentSenderNumber, trxId } = args;
        const order = await Order_1.default.findById(orderId);
        if (!order)
            return { success: false, error: 'Order not found' };
        order.senderNumber = paymentSenderNumber;
        order.transactionId = trxId;
        await order.save();
        return { success: true, message: 'Payment info updated' };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleTrackOrder = async (args) => {
    try {
        const order = await Order_1.default.findById(args.orderId);
        if (!order)
            return { success: false, error: 'Order not found' };
        return { success: true, order };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleRequestPasswordReset = async (args) => {
    try {
        const { identifier } = args;
        const user = await User_1.default.findOne({
            $or: [{ phone: identifier }, { email: identifier }]
        });
        if (!user) {
            return { success: false, error: 'No account found with this phone number or email.' };
        }
        const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(randomPassword, salt);
        await user.save();
        return { success: true, tempPassword: randomPassword, message: `Tell the user to login with this password and change it.` };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const executeTool = async (functionName, args) => {
    switch (functionName) {
        case 'getStoreCatalog':
            return await handleGetStoreCatalog();
        case 'createPendingOrder':
            return await handleCreatePendingOrder(args);
        case 'updateOrderPayment':
            return await handleUpdateOrderPayment(args);
        case 'trackOrder':
            return await handleTrackOrder(args);
        case 'requestPasswordReset':
            return await handleRequestPasswordReset(args);
        default:
            return { success: false, error: 'Unknown tool called' };
    }
};
const chatWithAgent = async (sessionId, userMessage, apiKey) => {
    if (!apiKey) {
        throw new Error("DeepSeek API key is missing");
    }
    const deepseek = new openai_1.default({
        baseURL: "https://api.deepseek.com/v1",
        apiKey: apiKey
    });
    try {
        let historyDoc = await ChatHistory_1.default.findOne({ sessionId });
        if (!historyDoc) {
            historyDoc = new ChatHistory_1.default({ sessionId, messages: [] });
        }
        const messages = [];
        messages.push({ role: 'system', content: prompt_1.SYSTEM_INSTRUCTION });
        for (const msg of historyDoc.messages) {
            let role = msg.role;
            if (role === 'model')
                role = 'assistant';
            const text = msg.parts?.[0]?.text || '';
            if (text) {
                messages.push({ role, content: text });
            }
        }
        messages.push({ role: 'user', content: userMessage });
        const makeDeepSeekRequest = async (currentMessages) => {
            const completion = await deepseek.chat.completions.create({
                messages: currentMessages,
                model: 'deepseek-chat',
                tools: tools,
                tool_choice: 'auto',
            });
            return completion;
        };
        let chatCompletion = await makeDeepSeekRequest(messages);
        let responseMessage = chatCompletion.choices[0]?.message;
        while (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
            messages.push(responseMessage);
            for (const tCall of responseMessage.tool_calls) {
                const toolCall = tCall;
                let args = {};
                try {
                    args = JSON.parse(toolCall.function.arguments || '{}');
                }
                catch (e) { }
                const toolResult = await executeTool(toolCall.function.name, args);
                messages.push({
                    tool_call_id: toolCall.id,
                    role: 'tool',
                    name: toolCall.function.name,
                    content: JSON.stringify(toolResult),
                });
            }
            chatCompletion = await makeDeepSeekRequest(messages);
            responseMessage = chatCompletion.choices[0]?.message;
        }
        let replyText = responseMessage?.content || "আমি দুঃখিত, আমি আপনার রিকুয়েস্টটি প্রসেস করতে পারছি না। দয়া করে আবার মেসেজ দিন।";
        // Clean up any hallucinated JSON tool calls from the text
        replyText = replyText.replace(/\{[\s\S]*"type"\s*:\s*"function"[\s\S]*\}/g, '').trim();
        if (!replyText)
            replyText = "আপনার রিকোয়েস্টটি প্রসেস করা হচ্ছে...";
        historyDoc.messages.push({ role: 'user', parts: [{ text: userMessage }] });
        historyDoc.messages.push({ role: 'model', parts: [{ text: replyText }] });
        await historyDoc.save();
        return replyText;
    }
    catch (err) {
        console.error('Error in chatWithAgent (DeepSeek):', err);
        throw err; // Re-throw to allow AI Manager to catch and fallback
    }
};
exports.chatWithAgent = chatWithAgent;
