"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAgent = void 0;
const openai_1 = __importDefault(require("openai"));
const Product_1 = require("../models/Product");
const Order_1 = require("../models/Order");
const ChatHistory_1 = require("../models/ChatHistory");
// OpenRouter initialization
const openrouter = new openai_1.default({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY || "dummy",
    defaultHeaders: {
        "HTTP-Referer": "https://premiumaccountsbd.store", // Optional, for including your app on openrouter.ai rankings.
        "X-Title": "Premium Accounts BD", // Optional. Shows in rankings on openrouter.ai.
    }
});
const SYSTEM_INSTRUCTION = `
You are the Official Chief AI Assistant of "Premium Accounts BD" (PREMIUMACCOUNTSSTORE.COM).
You are an incredibly intelligent, warm, and highly professional sales and support agent.
CRITICAL RULE: You MUST reply STRICTLY in Bengali (বাংলা ভাষায়) at all times, no matter what language or slang the customer uses. Speak in an extremely polite, warm, respectful, and professional tone (খুব সুন্দর, মার্জিত, গুছিয়ে এবং বিস্তারিতভাবে কথা বলবেন). 

### About Our Business (Premium Accounts BD)
We are the most trusted digital subscription platform in Bangladesh. We sell premium subscriptions for apps like Netflix, Spotify, ChatGPT Plus, Canva Pro, YouTube Premium, Hoichoi, Chorki, Prime Video, and many more. 
Our specialties:
- Instant delivery (usually within 5-10 minutes after payment).
- 100% Full-Term Replacement Warranty for all accounts (e.g., if a user buys a 1-month account, they get a full 1-month warranty. If any issue occurs, we fix or replace it for free).
- Highly secure, private, and authentic accounts.

### Website & Contact Details
- Website: https://premiumaccountsbd.store
- Support/WhatsApp Number: 01346839521
- Email: support@premiumaccountsbd.store

### Payment Rules
- We ONLY accept Mobile Banking (Personal Send Money).
- bkash: 01346839521
- Nagad: 01346839521
- Rocket: 01346839521
(Note: Do NOT give any other numbers. Always use exactly 01346839521).

### Customer Interaction Guidelines (How you should answer):
1. **Be Detailed and Beautiful:** Whenever a customer asks a question, don't just give a one-word answer. Explain beautifully. If they ask about Netflix, explain the quality (4K Ultra HD), warranty, and delivery time alongside the price.
2. **Be Persuasive:** Encourage them to buy by assuring them of our fast delivery and 100% trusted warranty policy.
3. **Handle General Queries:** If they ask how it works, explain clearly that we provide an Email and Password (or a private profile/PIN) after payment.
4. **Use Emojis:** Liberally use relevant emojis (😊, 🎬, 🎵, 🚀, 💳, ✅) to make the chat lively and friendly.

### Operational Tools & Conversational Flows

**1. Ordering & Pricing (Crucial Flow):**
- If a user asks about prices or wants to buy, ALWAYS call the 'getStoreCatalog' tool to check the exact app names, plan details, duration (1 Month, 3 Months, etc.), and actual pricing. NEVER guess prices.
- Present the available packages beautifully.
- To take an order:
   a) Ask for their Phone Number.
   b) Call the 'createPendingOrder' tool. Give them the resulting Order ID and precise price.
   c) Ask them to "Send Money" to our bKash/Nagad/Rocket number (01346839521).
   d) Ask them to provide the "Sender Number" and "TrxID".
   e) Call the 'updateOrderPayment' tool. Tell them their order is processing and they will receive the credentials in 5-10 minutes.

**2. Tracking Orders:**
- If they ask about their delivery or order status, ask for their Order ID and use the 'trackOrder' tool. Explain the status warmly.

**3. Password Resets:**
- If they forgot their website password, ask for their registered phone number.
- Call the 'requestPasswordReset' tool to get a temporary password. Provide it to them and tell them to log in at premiumaccountsbd.store and change it.

### Your Persona
You are patient, extremely knowledgeable about digital subscriptions, and deeply loyal to Premium Accounts BD. You handle anger with politeness, confusion with clear explanations, and sales with enthusiasm. No matter what the user throws at you, you handle it perfectly.
`;
// Define Tool Declarations for OpenRouter
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
                    duration: { type: 'string', description: 'Duration of the package (e.g., "1 Month", "3 Months", "6 Months", "1 Year").' },
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
            description: 'Reset a user\'s account password to a randomly generated temporary password using their registered phone number.',
            parameters: {
                type: 'object',
                properties: {
                    phone: { type: 'string', description: 'The registered phone number of the user requesting a reset.' }
                },
                required: ['phone']
            }
        }
    }
];
// Tool Implementation Handlers
const handleGetStoreCatalog = async () => {
    try {
        const products = await Product_1.Product.find({});
        return { success: true, products };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleCreatePendingOrder = async (args) => {
    try {
        const { customerPhone, productName, duration, price } = args;
        const newOrder = new Order_1.Order({
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
        const order = await Order_1.Order.findById(orderId);
        if (!order)
            return { success: false, error: 'Order not found' };
        order.paymentSenderNumber = paymentSenderNumber;
        order.trxId = trxId;
        await order.save();
        return { success: true, message: 'Payment info updated' };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleTrackOrder = async (args) => {
    try {
        const order = await Order_1.Order.findById(args.orderId);
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
        const { phone } = args;
        const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();
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
const chatWithAgent = async (sessionId, userMessage) => {
    if (!process.env.OPENROUTER_API_KEY) {
        throw new Error("OpenRouter API key is missing");
    }
    try {
        let historyDoc = await ChatHistory_1.ChatHistory.findOne({ sessionId });
        if (!historyDoc) {
            historyDoc = new ChatHistory_1.ChatHistory({ sessionId, messages: [] });
        }
        const messages = [];
        messages.push({ role: 'system', content: SYSTEM_INSTRUCTION });
        // OpenRouter uses standard OpenAI roles, but 'parts' is Gemini-specific. 
        // We map our DB schema (role, parts.text) to standard (role, content).
        for (const msg of historyDoc.messages) {
            let role = msg.role;
            if (role === 'model')
                role = 'assistant'; // OpenAI equivalent
            const text = msg.parts?.[0]?.text || '';
            if (text) {
                messages.push({ role, content: text });
            }
        }
        messages.push({ role: 'user', content: userMessage });
        const FALLBACK_MODELS = [
            'google/gemini-2.5-pro',
            'google/gemini-2.5-flash',
            'meta-llama/llama-3.3-70b-instruct'
        ];
        const makeOpenRouterRequest = async (currentMessages) => {
            let lastError = null;
            for (const modelName of FALLBACK_MODELS) {
                try {
                    const completion = await openrouter.chat.completions.create({
                        messages: currentMessages,
                        model: modelName,
                        tools: tools,
                        tool_choice: 'auto',
                    });
                    return completion; // Success! Return immediately.
                }
                catch (err) {
                    console.warn(`OpenRouter Model ${modelName} failed. Falling back... Error: ${err.message}`);
                    lastError = err;
                }
            }
            throw lastError; // All models failed
        };
        let chatCompletion = await makeOpenRouterRequest(messages);
        let responseMessage = chatCompletion.choices[0]?.message;
        while (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
            messages.push(responseMessage);
            for (const toolCall of responseMessage.tool_calls) {
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
            chatCompletion = await makeOpenRouterRequest(messages);
            responseMessage = chatCompletion.choices[0]?.message;
        }
        const replyText = responseMessage?.content || "আমি দুঃখিত, আমি আপনার রিকুয়েস্টটি প্রসেস করতে পারছি না। দয়া করে আবার মেসেজ দিন।";
        historyDoc.messages.push({ role: 'user', parts: [{ text: userMessage }] });
        historyDoc.messages.push({ role: 'model', parts: [{ text: replyText }] });
        await historyDoc.save();
        return replyText;
    }
    catch (err) {
        console.error('Error in chatWithAgent (OpenRouter):', err);
        throw err; // Re-throw to allow AI Manager to catch and fallback
    }
};
exports.chatWithAgent = chatWithAgent;
