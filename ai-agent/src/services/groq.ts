import Groq from 'groq-sdk';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
import ChatHistory from '../models/ChatHistory';
import bcrypt from 'bcryptjs';

const getGroqAI = () => {
  const apiKey = process.env.GROQ_API_KEY;
  return new Groq({ apiKey });
};

const SYSTEM_INSTRUCTION = `
You are the official AI Assistant of PREMIUMACCOUNTSSTORE.COM (Premium Accounts BD).
CRITICAL RULE: You MUST reply STRICTLY in Bengali (বাংলা ভাষায়) at all times, no matter what language the customer uses. Speak in an extremely polite, warm, respectful, and professional tone (খুব সুন্দর, মার্জিত এবং ভদ্র ভাষায় কথা বলবেন). 

Website Details:
- Website Link: https://premiumaccountsbd.store
- Support/WhatsApp Number: 01346839521
- Email: support@premiumaccountsbd.store

Payment Details:
- We ONLY accept Mobile Banking (Send Money).
- bkash (Personal Send Money): 01346839521
- Nagad (Personal Send Money): 01346839521
- Rocket (Personal Send Money): 01346839521
(Note: Do NOT give old numbers. Always use 01346839521 for payments).

Ordering Conversational Flow:
1. When a customer wants to buy something, ALWAYS use the getStoreCatalog tool to check the actual pricing and plans.
2. Ask for their phone number (e.g., '01XXXXXXXXX') to link the order.
3. Call createPendingOrder tool to register a pending order inside our system. It will return an Order ID and the exact price.
4. Give them our payment number (01346839521) and ask them to Send Money via bKash/Nagad/Rocket.
5. Once they send money, politely ask them to reply with the Sender Phone Number and the Transaction ID (TrxID).
6. When they provide those details, call the updateOrderPayment tool. Once saved, let them know that their order is now submitted and our admin will verify the payment and deliver their login credentials (Email, Password, Profile/PIN) very soon. Tell them they can check their order status anytime by providing their Order ID.

Password Reset Flow:
1. If a customer forgot their website password, ask for their registered phone number.
2. Call the requestPasswordReset tool. It will generate a temporary 6-digit password.
3. Give them the temporary password and politely advise them to log in at premiumaccountsbd.store and change it from their profile.

Remember: Be very helpful, use emojis where appropriate to make the chat friendly, and ALWAYS reply in beautiful Bengali language.
`;

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

const handleRequestPasswordReset = async (phone: string) => {
  try {
    const user = await User.findOne({ phone });
    if (!user) return { success: false, error: 'No account found with this phone number.' };
    
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
    case 'requestPasswordReset': return await handleRequestPasswordReset(args.phone);
    default: throw new Error(`Unknown function: ${name}`);
  }
};

// Main interface to chat with the AI agent
export const chatWithAgent = async (sessionId: string, userMessage: string): Promise<string> => {
  try {
    let historyDoc = await ChatHistory.findOne({ sessionId });
    if (!historyDoc) {
      historyDoc = new ChatHistory({ sessionId, messages: [] });
    }

    const groq = getGroqAI();
    
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

    let chatCompletion = await groq.chat.completions.create({
      messages: messages as any,
      model: 'llama-3.3-70b-versatile',
      tools: tools as any,
      tool_choice: 'auto',
    });

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
      
      chatCompletion = await groq.chat.completions.create({
        messages: messages as any,
        model: 'llama-3.3-70b-versatile',
        tools: tools as any,
        tool_choice: 'auto',
      });
      
      responseMessage = chatCompletion.choices[0]?.message;
    }

    const replyText = responseMessage?.content || "আমি দুঃখিত, আমি আপনার রিকুয়েস্টটি প্রসেস করতে পারছি না। দয়া করে আবার মেসেজ দিন।";

    // Reconstruct history to save back to DB in our standard schema
    historyDoc.messages.push({ role: 'user', parts: [{ text: userMessage }] });
    historyDoc.messages.push({ role: 'model', parts: [{ text: replyText }] });
    await historyDoc.save();

    return replyText;
  } catch (err: any) {
    console.error('Error in chatWithAgent (Groq):', err);
    return `দুঃখিত, বর্তমানে একটি টেকনিক্যাল সমস্যার কারণে আমি আপনার মেসেজটি প্রসেস করতে পারছি না। (Error: ${err.message})`;
  }
};
