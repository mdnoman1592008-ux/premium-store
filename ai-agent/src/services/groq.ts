import Groq from 'groq-sdk';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
import ChatHistory from '../models/ChatHistory';
import bcrypt from 'bcryptjs';

import { SYSTEM_INSTRUCTION } from './prompt';

// Define Tool Declarations for Groq
const tools: any[] = [
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
    const products = await Product.find({});
    return { success: true, products };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleTrackOrder = async (orderId: string) => {
  try {
    const order = await Order.findOne({ orderId }).populate('product');
    if (!order) return { success: false, error: 'Order not found.' };
    return { success: true, order };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleCancelOrder = async (orderId: string) => {
  try {
    const order = await Order.findOne({ orderId });
    if (!order) return { success: false, error: 'Order not found.' };
    if (order.status === 'Delivered' || order.status === 'Cancelled') {
      return { success: false, error: `Cannot cancel order because it is already ${order.status}.` };
    }
    order.status = 'Cancelled';
    await order.save();
    return { success: true, message: 'Order has been successfully cancelled.' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleCreatePendingOrder = async (phone: string, appId: string, planName: string, durationLabel: string) => {
  try {
    const user = await User.findOne({ phone });
    const product = await Product.findOne({ id: appId });
    if (!product) return { success: false, error: 'Product/App not found in catalog.' };
    
    const plan = product.plans.find((p: any) => p.planName === planName);
    if (!plan) return { success: false, error: 'Plan not found.' };
    
    const duration = plan.durations.find((d: any) => d.label === durationLabel);
    if (!duration) return { success: false, error: 'Duration not found for this plan.' };

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder = new Order({
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
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleUpdateOrderPayment = async (orderId: string, paymentMethod: string, transactionId: string, senderNumber: string) => {
  try {
    const order = await Order.findOne({ orderId });
    if (!order) return { success: false, error: 'Order not found.' };
    
    order.paymentMethod = paymentMethod;
    order.transactionId = transactionId;
    order.senderNumber = senderNumber;
    order.status = 'Verified';
    await order.save();
    return { success: true, message: 'Payment details added. Order is now Verified.' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

const handleRequestPasswordReset = async (identifier: string) => {
  try {
    const user = await User.findOne({ 
      $or: [ { phone: identifier }, { email: identifier } ] 
    });
    if (!user) return { success: false, error: 'No account found with this phone number or email.' };
    
    const tempPassword = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(tempPassword, salt);
    await user.save();
    
    return { success: true, tempPassword, message: 'Password has been reset to temporary password.' };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

// Dispatcher
const executeTool = async (name: string, args: any) => {
  console.log(`Executing tool: ${name} with args:`, args);
  switch (name) {
    case 'getStoreCatalog': return await handleGetStoreCatalog();
    case 'trackOrder': return await handleTrackOrder(args.orderId);
    case 'cancelOrder': return await handleCancelOrder(args.orderId);
    case 'createPendingOrder': return await handleCreatePendingOrder(args.phone, args.appId, args.planName, args.durationLabel);
    case 'updateOrderPayment': return await handleUpdateOrderPayment(args.orderId, args.paymentMethod, args.transactionId, args.senderNumber);
    case 'requestPasswordReset': return await handleRequestPasswordReset(args.identifier);
    default: throw new Error(`Unknown function: ${name}`);
  }
};

// Main interface to chat with the AI agent
export const chatWithAgent = async (sessionId: string, userMessage: string, apiKey: string): Promise<string> => {
  if (!apiKey) {
      throw new Error("Groq API key is missing");
  }
  try {
    const groq = new Groq({ apiKey });
    let historyDoc = await ChatHistory.findOne({ sessionId });
    if (!historyDoc) {
      historyDoc = new ChatHistory({ sessionId, messages: [] });
    }

    const messages = [];
    messages.push({ role: 'system', content: SYSTEM_INSTRUCTION });
    
    for (const msg of historyDoc.messages) {
      if (msg.role === 'model') {
        const textParts = msg.parts?.filter((p: any) => p.text).map((p: any) => p.text).join('') || '';
        const functionCalls = msg.parts?.filter((p: any) => p.functionCall).map((p: any) => ({
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
      } else if (msg.role === 'user') {
        const textParts = msg.parts?.filter((p: any) => p.text).map((p: any) => p.text).join('') || '';
        const functionResponses = msg.parts?.filter((p: any) => p.functionResponse);
        
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
      'llama-3.1-8b-instant',
      'gemma2-9b-it'
    ];

    const makeGroqRequest = async (currentMessages: any[]) => {
      let lastError = null;
      for (const modelName of FALLBACK_MODELS) {
        try {
          const completion = await groq.chat.completions.create({
            messages: currentMessages,
            model: modelName,
            tools: tools as any,
            tool_choice: 'auto',
          });
          return completion; // Success! Return immediately.
        } catch (err: any) {
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
        try { args = JSON.parse(toolCall.function.arguments); } catch(e) {}
        
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

    let replyText = responseMessage?.content || "আমি দুঃখিত, আমি আপনার রিকুয়েস্টটি প্রসেস করতে পারছি না। দয়া করে আবার মেসেজ দিন।";

    // Clean up any hallucinated JSON tool calls from the text
    replyText = replyText.replace(/\{[\s\S]*"type"\s*:\s*"function"[\s\S]*\}/g, '').trim();
    if (!replyText) replyText = "আপনার রিকোয়েস্টটি প্রসেস করা হচ্ছে...";

    // Reconstruct history to save back to DB in our standard schema
    historyDoc.messages.push({ role: 'user', parts: [{ text: userMessage }] });
    historyDoc.messages.push({ role: 'model', parts: [{ text: replyText }] });
    await historyDoc.save();

    return replyText;
  } catch (err: any) {
    console.error('Error in chatWithAgent (Groq):', err);
    throw err; // Re-throw to allow AI Manager to catch and fallback
  }
};
