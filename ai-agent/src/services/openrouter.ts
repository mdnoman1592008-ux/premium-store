import OpenAI from 'openai';
import Product from '../models/Product';
import Order from '../models/Order';
import ChatHistory from '../models/ChatHistory';
import { SYSTEM_INSTRUCTION } from './prompt';

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
    const products = await Product.find({});
    return { success: true, products };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleCreatePendingOrder = async (args: any) => {
  try {
    const { customerPhone, productName, duration, price } = args;
    const newOrder = new Order({
      customerPhone,
      productName,
      duration,
      price,
      status: 'Pending',
      orderDate: new Date()
    });
    const saved = await newOrder.save();
    return { success: true, message: 'Order created', orderId: saved._id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleUpdateOrderPayment = async (args: any) => {
  try {
    const { orderId, paymentSenderNumber, trxId } = args;
    const order = await Order.findById(orderId);
    if (!order) return { success: false, error: 'Order not found' };
    order.senderNumber = paymentSenderNumber;
    order.transactionId = trxId;
    await order.save();
    return { success: true, message: 'Payment info updated' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleTrackOrder = async (args: any) => {
  try {
    const order = await Order.findById(args.orderId);
    if (!order) return { success: false, error: 'Order not found' };
    return { success: true, order };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleRequestPasswordReset = async (args: any) => {
  try {
    const { phone } = args;
    const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();
    return { success: true, tempPassword: randomPassword, message: `Tell the user to login with this password and change it.` };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const executeTool = async (functionName: string, args: any) => {
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

export const chatWithAgent = async (sessionId: string, userMessage: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
      throw new Error("OpenRouter API key is missing");
  }

  const openrouter = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey,
    defaultHeaders: {
      "HTTP-Referer": "https://premiumaccountsbd.store",
      "X-Title": "Premium Accounts BD",
    }
  });

  try {
    let historyDoc = await ChatHistory.findOne({ sessionId });
    if (!historyDoc) {
      historyDoc = new ChatHistory({ sessionId, messages: [] });
    }

    const messages: any[] = [];
    messages.push({ role: 'system', content: SYSTEM_INSTRUCTION });
    
    // OpenRouter uses standard OpenAI roles, but 'parts' is Gemini-specific. 
    // We map our DB schema (role, parts.text) to standard (role, content).
    for (const msg of historyDoc.messages) {
      let role = msg.role;
      if (role === 'model') role = 'assistant' as any; // OpenAI equivalent
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

    const makeOpenRouterRequest = async (currentMessages: any[]) => {
      let lastError = null;
      for (const modelName of FALLBACK_MODELS) {
        try {
          const completion = await openrouter.chat.completions.create({
            messages: currentMessages as any,
            model: modelName,
            tools: tools as any,
            tool_choice: 'auto',
          });
          return completion; // Success! Return immediately.
        } catch (err: any) {
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
      
      for (const tCall of responseMessage.tool_calls) {
        const toolCall = tCall as any;
        let args = {};
        try { args = JSON.parse(toolCall.function.arguments || '{}'); } catch(e) {}
        
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

    let replyText = responseMessage?.content || "আমি দুঃখিত, আমি আপনার রিকুয়েস্টটি প্রসেস করতে পারছি না। দয়া করে আবার মেসেজ দিন।";

    // Clean up any hallucinated JSON tool calls from the text
    replyText = replyText.replace(/\{[\s\S]*"type"\s*:\s*"function"[\s\S]*\}/g, '').trim();
    if (!replyText) replyText = "আপনার রিকোয়েস্টটি প্রসেস করা হচ্ছে...";

    historyDoc.messages.push({ role: 'user', parts: [{ text: userMessage }] });
    historyDoc.messages.push({ role: 'model', parts: [{ text: replyText }] });
    await historyDoc.save();

    return replyText;
  } catch (err: any) {
    console.error('Error in chatWithAgent (OpenRouter):', err);
    throw err; // Re-throw to allow AI Manager to catch and fallback
  }
};
