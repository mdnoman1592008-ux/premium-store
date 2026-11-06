import { GoogleGenerativeAI } from '@google/generative-ai';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
import ChatHistory from '../models/ChatHistory';
import bcrypt from 'bcryptjs';
import { SYSTEM_INSTRUCTION } from './prompt';
import { getCachedProducts, getCachedCatalogSummaryText, saveChatHistoryAsync } from './cache';

const tools: any[] = [
  {
    functionDeclarations: [
      {
        name: 'getStoreCatalog',
        description: 'Fetch the active list of digital products, subscription plans, pricing, features, and durations from the database catalog.',
        parameters: { type: 'object', properties: {} }
      },
      {
        name: 'trackOrder',
        description: 'Fetch the current status, app/plan details, price, payment info, and credentials of a subscription order by its unique Order ID.',
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
            planName: { type: 'string', description: 'The specific name of the plan.' },
            durationLabel: { type: 'string', description: 'Duration of the package (e.g., "1 Month", "3 Months", "6 Months", "12 Months").' }
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
            paymentMethod: { type: 'string', description: 'The selected payment method used (e.g. bkash, nagad, rocket).' },
            transactionId: { type: 'string', description: 'The transaction ID of the send money payment.' },
            senderNumber: { type: 'string', description: 'The sender phone number used to send the money.' }
          },
          required: ['orderId', 'paymentMethod', 'transactionId', 'senderNumber']
        }
      },
      {
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
    ]
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

const handleTrackOrder = async (args: { orderId: string }) => {
  try {
    const order = await Order.findOne({ orderId: args.orderId }).lean();
    if (!order) {
      return { success: false, message: `No order found with ID: ${args.orderId}` };
    }
    return { success: true, order };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleCancelOrder = async (args: { orderId: string }) => {
  try {
    const order = await Order.findOne({ orderId: args.orderId });
    if (!order) {
      return { success: false, message: `No order found with ID: ${args.orderId}` };
    }
    if (order.status !== 'Pending') {
      return { success: false, message: `Order status is '${order.status}' and cannot be cancelled.` };
    }
    order.status = 'Cancelled';
    await order.save();
    return { success: true, message: `Order #${args.orderId} has been successfully cancelled.` };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleCreatePendingOrder = async (args: { phone: string; appId: string; planName: string; durationLabel: string }) => {
  try {
    let user = await User.findOne({ phone: args.phone });
    if (!user) {
      const tempPass = Math.floor(100000 + Math.random() * 900000).toString();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(tempPass, salt);
      user = await User.create({
        phone: args.phone,
        password: hashedPassword,
        name: `Customer ${args.phone.slice(-4)}`
      });
    }

    const product = await Product.findOne({ appId: args.appId.toLowerCase() });
    if (!product) {
      return { success: false, message: `Product not found with App ID: ${args.appId}` };
    }

    const plan = product.plans.find(p => p.planName.toLowerCase() === args.planName.toLowerCase() || p.planName.toLowerCase().includes(args.planName.toLowerCase()));
    if (!plan) {
      return { success: false, message: `Plan '${args.planName}' not found. Available plans: ${product.plans.map(p => p.planName).join(', ')}` };
    }

    const duration = plan.durations.find(d => d.label.toLowerCase() === args.durationLabel.toLowerCase() || d.label.toLowerCase().includes(args.durationLabel.toLowerCase()));
    if (!duration) {
      return { success: false, message: `Duration '${args.durationLabel}' not found. Available: ${plan.durations.map(d => d.label).join(', ')}` };
    }

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder = await Order.create({
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
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleUpdateOrderPayment = async (args: { orderId: string; paymentMethod: string; transactionId: string; senderNumber: string }) => {
  try {
    const order = await Order.findOne({ orderId: args.orderId });
    if (!order) {
      return { success: false, message: `No order found with ID: ${args.orderId}` };
    }

    order.paymentMethod = args.paymentMethod;
    order.transactionId = args.transactionId;
    order.senderNumber = args.senderNumber;
    order.status = 'Pending';
    await order.save();

    return { success: true, message: `Order #${args.orderId} payment details updated successfully. Pending admin verification.` };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleRequestPasswordReset = async (args: { identifier: string }) => {
  try {
    const user = await User.findOne({
      $or: [{ phone: args.identifier }, { email: args.identifier }]
    });

    if (!user) {
      return { success: false, message: `No registered user found with phone number or email: ${args.identifier}` };
    }

    const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return { success: true, tempPassword, message: `Password reset successfully for ${args.identifier}.` };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const executeTool = async (name: string, args: any) => {
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

const GEMINI_MODEL_FALLBACKS = [
  'models/gemini-2.0-flash',
  'models/gemini-2.0-flash-lite',
  'models/gemini-2.5-flash-lite',
  'models/gemini-2.5-flash',
];

let preferredGeminiModel: string | null = null;

export const chatWithAgent = async (
  sessionId: string,
  userMessage: string,
  apiKey: string
): Promise<string> => {
  if (!apiKey) {
    throw new Error("Gemini API key is missing");
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    const [historyDoc, catalogSummary] = await Promise.all([
      ChatHistory.findOne({ sessionId }).lean(),
      getCachedCatalogSummaryText()
    ]);

    const recentMessages = (historyDoc?.messages || []).slice(-6);
    const sdkHistory: any[] = [
      {
        role: 'user',
        parts: [{ text: `[SYSTEM INSTRUCTION: ${SYSTEM_INSTRUCTION + catalogSummary}]\n\nHello` }]
      },
      {
        role: 'model',
        parts: [{ text: 'Understood. How can I help you today?' }]
      }
    ];

    for (const m of recentMessages) {
      const textParts = (m.parts || []).filter((p: any) => p.text).map((p: any) => ({ text: p.text }));
      if (textParts.length > 0) {
        sdkHistory.push({
          role: m.role === 'model' ? 'model' : 'user',
          parts: textParts
        });
      }
    }

    const orderedModels = preferredGeminiModel
      ? [preferredGeminiModel, ...GEMINI_MODEL_FALLBACKS.filter(m => m !== preferredGeminiModel)]
      : GEMINI_MODEL_FALLBACKS;

    let result: any = null;
    let chat: any = null;

    for (const modelName of orderedModels) {
      const m = genAI.getGenerativeModel({
        model: modelName,
        tools,
        generationConfig: { maxOutputTokens: 450, temperature: 0.4 }
      });
      chat = m.startChat({ history: sdkHistory });
      try {
        result = await chat.sendMessage(userMessage);
        preferredGeminiModel = modelName;
        break;
      } catch (err: any) {
        console.warn(`❌ Model ${modelName} failed: ${err.message?.substring(0, 80)}`);
        chat = null;
        result = null;
      }
    }

    if (!result || !chat) {
      throw new Error('All Gemini models failed for this API key.');
    }

    let calls = typeof result.functionCalls === 'function' ? result.functionCalls() : result.functionCalls;
    while (calls && calls.length > 0) {
      const toolCall = calls[0];
      const toolResult = await executeTool(toolCall.name, toolCall.args);
      result = await chat.sendMessage([{ functionResponse: { name: toolCall.name, response: toolResult } }]);
      calls = typeof result.functionCalls === 'function' ? result.functionCalls() : result.functionCalls;
    }

    let replyText = '';
    try {
      replyText = result.response.text();
    } catch (err) {
      console.warn("Gemini didn't return text.");
    }

    if (!replyText || replyText.trim() === '') {
      replyText = "আমি দুঃখিত, আমি আপনার রিকুয়েস্টটি প্রসেস করতে পারছি না। দয়া করে আবার মেসেজ দিন।";
    }

    replyText = replyText.replace(/\{[\s\S]*"type"\s*:\s*"function"[\s\S]*\}/g, '').trim();
    if (!replyText) replyText = "আপনার রিকোয়েস্টটি প্রসেস করা হচ্ছে...";

    saveChatHistoryAsync(sessionId, userMessage, replyText);

    return replyText;
  } catch (err: any) {
    console.error('Error in chatWithAgent (Gemini):', err);
    throw err;
  }
};
