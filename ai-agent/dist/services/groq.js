"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatWithAgent = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const Product_1 = __importDefault(require("../models/Product"));
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const ChatHistory_1 = __importDefault(require("../models/ChatHistory"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getGroqAI = () => {
    const apiKey = process.env.GROQ_API_KEY;
    return new groq_sdk_1.default({ apiKey });
};
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
// Define Tool Declarations for Groq
const tools = [
    {
        type: "function",
        function: {
            name: 'getStoreCatalog',
            description: 'Fetch the active list of digital products, subscription plans, pricing, features, and durations from the database catalog.',
            parameters: { type: 'object', properties: {} }
        }
    },
    {
        type: "function",
        function: {
            name: 'trackOrder',
            description: 'Fetch the current status, app/plan details, price, payment info, and credentials (email/password/pin) of a subscription order by its unique Order ID.',
            parameters: {
                type: 'object',
                properties: {
                    orderId: { type: 'string', description: 'The unique Order ID to track (e.g. ORD-123456).' }
                },
                required: ['orderId']
            }
        }
    },
    {
        type: "function",
        function: {
            name: 'cancelOrder',
            description: 'Cancel a pending subscription order in the database by its Order ID.',
            parameters: {
                type: 'object',
                properties: {
                    orderId: { type: 'string', description: 'The unique Order ID to cancel.' }
                },
                required: ['orderId']
            }
        }
    },
    {
        type: "function",
        function: {
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
        }
    },
    {
        type: "function",
        function: {
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
        const products = await Product_1.default.find({});
        return { success: true, products };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleTrackOrder = async (orderId) => {
    try {
        const order = await Order_1.default.findOne({ orderId }).populate('product');
        if (!order)
            return { success: false, error: 'Order not found.' };
        return { success: true, order };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleCancelOrder = async (orderId) => {
    try {
        const order = await Order_1.default.findOne({ orderId });
        if (!order)
            return { success: false, error: 'Order not found.' };
        if (order.status === 'Delivered' || order.status === 'Cancelled') {
            return { success: false, error: `Cannot cancel order because it is already ${order.status}.` };
        }
        order.status = 'Cancelled';
        await order.save();
        return { success: true, message: 'Order has been successfully cancelled.' };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleCreatePendingOrder = async (phone, appId, planName, durationLabel) => {
    try {
        const user = await User_1.default.findOne({ phone });
        const product = await Product_1.default.findOne({ id: appId });
        if (!product)
            return { success: false, error: 'Product/App not found in catalog.' };
        const plan = product.plans.find((p) => p.planName === planName);
        if (!plan)
            return { success: false, error: 'Plan not found.' };
        const duration = plan.durations.find((d) => d.label === durationLabel);
        if (!duration)
            return { success: false, error: 'Duration not found for this plan.' };
        const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        const newOrder = new Order_1.default({
            orderId,
            userId: user ? user._id : undefined,
            appName: product.appName,
            planName: plan.planName,
            duration: duration.label,
            price: duration.price,
            paymentMethod: 'pending',
            transactionId: 'pending',
            senderNumber: phone,
            status: 'Pending'
        });
        await newOrder.save();
        return { success: true, orderId, price: duration.price, message: 'Pending order created. Await payment.' };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleUpdateOrderPayment = async (orderId, paymentMethod, transactionId, senderNumber) => {
    try {
        const order = await Order_1.default.findOne({ orderId });
        if (!order)
            return { success: false, error: 'Order not found.' };
        order.paymentMethod = paymentMethod;
        order.transactionId = transactionId;
        order.senderNumber = senderNumber;
        order.status = 'Verified';
        await order.save();
        return { success: true, message: 'Payment details added. Order is now Verified.' };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
const handleRequestPasswordReset = async (phone) => {
    try {
        const user = await User_1.default.findOne({ phone });
        if (!user)
            return { success: false, error: 'No account found with this phone number.' };
        const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(tempPassword, salt);
        await user.save();
        return { success: true, tempPassword, message: 'Password has been reset to temporary password.' };
    }
    catch (err) {
        return { success: false, error: err.message };
    }
};
// Dispatcher
const executeTool = async (name, args) => {
    console.log(`Executing tool: ${name} with args:`, args);
    switch (name) {
        case 'getStoreCatalog': return await handleGetStoreCatalog();
        case 'trackOrder': return await handleTrackOrder(args.orderId);
        case 'cancelOrder': return await handleCancelOrder(args.orderId);
        case 'createPendingOrder': return await handleCreatePendingOrder(args.phone, args.appId, args.planName, args.durationLabel);
        case 'updateOrderPayment': return await handleUpdateOrderPayment(args.orderId, args.paymentMethod, args.transactionId, args.senderNumber);
        case 'requestPasswordReset': return await handleRequestPasswordReset(args.phone);
        default: throw new Error(`Unknown function: ${name}`);
    }
};
// Main interface to chat with the AI agent
const chatWithAgent = async (sessionId, userMessage) => {
    try {
        let historyDoc = await ChatHistory_1.default.findOne({ sessionId });
        if (!historyDoc) {
            historyDoc = new ChatHistory_1.default({ sessionId, messages: [] });
        }
        const groq = getGroqAI();
        const messages = [];
        messages.push({ role: 'system', content: SYSTEM_INSTRUCTION });
        for (const msg of historyDoc.messages) {
            if (msg.role === 'model') {
                const textParts = msg.parts?.filter((p) => p.text).map((p) => p.text).join('') || '';
                const functionCalls = msg.parts?.filter((p) => p.functionCall).map((p) => ({
                    id: p.functionCall.id || Math.random().toString(36).substring(7),
                    type: 'function',
                    function: { name: p.functionCall.name, arguments: JSON.stringify(p.functionCall.args || {}) }
                }));
                if (textParts || (functionCalls && functionCalls.length > 0)) {
                    messages.push({
                        role: 'assistant',
                        content: textParts || null,
                        ...(functionCalls && functionCalls.length > 0 ? { tool_calls: functionCalls } : {})
                    });
                }
            }
            else if (msg.role === 'user') {
                const textParts = msg.parts?.filter((p) => p.text).map((p) => p.text).join('') || '';
                const functionResponses = msg.parts?.filter((p) => p.functionResponse);
                if (textParts) {
                    messages.push({ role: 'user', content: textParts });
                }
                if (functionResponses && functionResponses.length > 0) {
                    for (const fr of functionResponses) {
                        messages.push({
                            role: 'tool',
                            tool_call_id: fr.functionResponse.id || 'unknown_id',
                            name: fr.functionResponse.name,
                            content: JSON.stringify(fr.functionResponse.response)
                        });
                    }
                }
            }
        }
        messages.push({ role: 'user', content: userMessage });
        const FALLBACK_MODELS = [
            'llama-3.3-70b-versatile',
            'llama3-70b-8192',
            'mixtral-8x7b-32768',
            'gemma-7b-it'
        ];
        const makeGroqRequest = async (currentMessages) => {
            let lastError = null;
            for (const modelName of FALLBACK_MODELS) {
                try {
                    const completion = await groq.chat.completions.create({
                        messages: currentMessages,
                        model: modelName,
                        tools: tools,
                        tool_choice: 'auto',
                    });
                    return completion; // Success! Return immediately.
                }
                catch (err) {
                    console.warn(`Groq Model ${modelName} failed. Falling back... Error: ${err.message}`);
                    lastError = err;
                }
            }
            throw lastError; // All models failed
        };
        let chatCompletion = await makeGroqRequest(messages);
        let responseMessage = chatCompletion.choices[0]?.message;
        while (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
            messages.push(responseMessage);
            for (const toolCall of responseMessage.tool_calls) {
                let args = {};
                try {
                    args = JSON.parse(toolCall.function.arguments);
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
            chatCompletion = await makeGroqRequest(messages);
            responseMessage = chatCompletion.choices[0]?.message;
        }
        const replyText = responseMessage?.content || "আমি দুঃখিত, আমি আপনার রিকুয়েস্টটি প্রসেস করতে পারছি না। দয়া করে আবার মেসেজ দিন।";
        // Reconstruct history to save back to DB in our standard schema
        historyDoc.messages.push({ role: 'user', parts: [{ text: userMessage }] });
        historyDoc.messages.push({ role: 'model', parts: [{ text: replyText }] });
        await historyDoc.save();
        return replyText;
    }
    catch (err) {
        console.error('Error in chatWithAgent (Groq):', err);
        return `দুঃখিত, বর্তমানে একটি টেকনিক্যাল সমস্যার কারণে আমি আপনার মেসেজটি প্রসেস করতে পারছি না। (Error: ${err.message})`;
    }
};
exports.chatWithAgent = chatWithAgent;
