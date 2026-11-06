import OpenAI from 'openai';
import Order from '../models/Order';
import ChatHistory from '../models/ChatHistory';
import { SYSTEM_INSTRUCTION } from './prompt';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { getCachedProducts, getCachedCatalogSummaryText, saveChatHistoryAsync } from './cache';

const tools = [
  {
    type: "function",
    function: {
      name: 'getStoreCatalog',
      description: 'Fetch the entire store catalog of Premium Accounts BD.',
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
          price: { type: 'number', description: 'The exact price in BDT.' }
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
      description: 'Look up an order status by Order ID. Returns order details including status.',
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

const handleGetStoreCatalog = async () => {
  try {
    const products = await getCachedProducts();
    return { success: true, products };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleCreatePendingOrder = async (args: any) => {
  try {
    const { customerPhone, productName, duration, price } = args;
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = new Order({
      orderId,
      appName: productName,
      planName: productName,
      duration,
      price,
      paymentMethod: 'Pending',
      transactionId: 'Pending',
      senderNumber: customerPhone,
      status: 'Pending'
    });
    const saved = await newOrder.save();
    return { success: true, message: 'Order created', orderId: saved.orderId || saved._id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleUpdateOrderPayment = async (args: any) => {
  try {
    const { orderId, paymentSenderNumber, trxId } = args;
    const order = await Order.findOne({ $or: [{ orderId }, ...(orderId?.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: orderId }] : [])] });
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
    const { orderId } = args;
    const order = await Order.findOne({ $or: [{ orderId }, ...(orderId?.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: orderId }] : [])] }).lean();
    if (!order) return { success: false, error: 'Order not found' };
    return { success: true, order };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleRequestPasswordReset = async (args: any) => {
  try {
    const { identifier } = args;
    const user = await User.findOne({
      $or: [{ phone: identifier }, { email: identifier }]
    });

    if (!user) {
      return { success: false, error: 'No account found with this phone number or email.' };
    }

    const randomPassword = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(randomPassword, salt);
    await user.save();

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
    throw new Error("DeepSeek API key is missing");
  }

  const deepseek = new OpenAI({
    baseURL: "https://api.deepseek.com/v1",
    apiKey: apiKey
  });

  try {
    const [historyDoc, catalogSummary] = await Promise.all([
      ChatHistory.findOne({ sessionId }).lean(),
      getCachedCatalogSummaryText()
    ]);

    const messages: any[] = [];
    messages.push({ role: 'system', content: SYSTEM_INSTRUCTION + catalogSummary });

    const recentMessages = (historyDoc?.messages || []).slice(-6);
    for (const msg of recentMessages) {
      let role: any = msg.role;
      if (role === 'model') role = 'assistant';
      const text = msg.parts?.[0]?.text || '';
      if (text) {
        messages.push({ role, content: text });
      }
    }

    messages.push({ role: 'user', content: userMessage });

    const makeDeepSeekRequest = async (currentMessages: any[]) => {
      const completion = await deepseek.chat.completions.create({
        messages: currentMessages as any,
        model: 'deepseek-chat',
        max_tokens: 450,
        temperature: 0.4,
        tools: tools as any,
        tool_choice: 'auto',
      });
      return completion;
    };

    let chatCompletion = await makeDeepSeekRequest(messages);
    let responseMessage = chatCompletion.choices[0]?.message;

    while (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      messages.push(responseMessage);

      for (const tCall of responseMessage.tool_calls) {
        const toolCall = tCall as any;
        let args = {};
        try { args = JSON.parse(toolCall.function.arguments || '{}'); } catch (e) {}

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

    replyText = replyText.replace(/\{[\s\S]*"type"\s*:\s*"function"[\s\S]*\}/g, '').trim();
    if (!replyText) replyText = "আপনার রিকোয়েস্টটি প্রসেস করা হচ্ছে...";

    saveChatHistoryAsync(sessionId, userMessage, replyText);

    return replyText;
  } catch (err: any) {
    console.error('Error in chatWithAgent (DeepSeek):', err);
    throw err;
  }
};
