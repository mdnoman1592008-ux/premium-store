import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import connectDB from './config/db';
import Admin from './models/Admin';
import {
  connectWhatsApp,
  disconnectWhatsApp,
  getWhatsAppStatus,
  getPairingCode
} from './services/whatsapp';
import {
  getFacebookSettings,
  saveFacebookSettings,
  verifyWebhook,
  handleWebhookEvent
} from './services/facebook';
import { chatWithAgent } from './services/gemini';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Admin token protection middleware
const adminProtect = async (req: any, res: any, next: any) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('adminProtect: Verifying token with JWT_SECRET length:', (process.env.JWT_SECRET || '').length);
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey123');
      const admin = await Admin.findById(decoded.id).select('-password');
      if (admin) {
        req.admin = admin;
        next();
      } else {
        console.error(`adminProtect: No admin user found in database with ID: ${decoded.id}`);
        res.status(401).json({ message: `Not authorized as admin: ID ${decoded.id} not found in database` });
      }
    } catch (error: any) {
      console.error('adminProtect: JWT verification failed:', error.message);
      res.status(401).json({ message: `Not authorized, token failed: ${error.message}` });
    }
  } else {
    console.error('adminProtect: No bearer token provided in headers:', req.headers.authorization);
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- WhatsApp Admin Endpoints ---

// Get current WhatsApp JID connection status and QR code
app.get('/api/agent/whatsapp/status', adminProtect, (req, res) => {
  const status = getWhatsAppStatus();
  res.json(status);
});

// Initialize / Connect WhatsApp
app.post('/api/agent/whatsapp/connect', adminProtect, async (req, res) => {
  try {
    await connectWhatsApp();
    res.json({ message: 'WhatsApp initialization started' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Disconnect / Log out from WhatsApp
app.post('/api/agent/whatsapp/disconnect', adminProtect, async (req, res) => {
  try {
    await disconnectWhatsApp();
    res.json({ message: 'WhatsApp disconnected successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Request pairing code for phone number
app.post('/api/agent/whatsapp/pair', adminProtect, async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    res.status(400).json({ message: 'Phone number is required' });
    return;
  }
  try {
    const code = await getPairingCode(phone);
    res.json({ pairingCode: code });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Facebook Messenger Endpoints ---

// Fetch Facebook credentials settings
app.get('/api/agent/facebook/settings', adminProtect, async (req, res) => {
  try {
    const settings = await getFacebookSettings();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update / Save Facebook settings
app.post('/api/agent/facebook/settings', adminProtect, async (req, res) => {
  const { pageId, accessToken, verifyToken } = req.body;
  try {
    await saveFacebookSettings({ pageId, accessToken, verifyToken });
    res.json({ message: 'Facebook Messenger settings updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Facebook Webhook Verify Endpoint (GET)
app.get('/api/agent/facebook/webhook', verifyWebhook);

// Facebook Webhook Event Handler (POST)
app.post('/api/agent/facebook/webhook', handleWebhookEvent);

// --- Website Chatbot Endpoints ---

// Public chat route for storefront chat widget
app.post('/api/agent/web/chat', async (req, res) => {
  const { sessionId, message } = req.body;
  if (!sessionId || !message) {
    res.status(400).json({ message: 'sessionId and message are required' });
    return;
  }
  try {
    const reply = await chatWithAgent(sessionId, message);
    res.json({ reply });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Default root route
app.get('/', (req, res) => {
  res.send('AI Agent Service API is running...');
});

const PORT = process.env.PORT || 5001;

// Start Server and Database Connection
connectDB().then(() => {
  // Auto-connect WhatsApp on start so session loads automatically
  connectWhatsApp();

  app.listen(PORT, () => {
    console.log(`AI Agent server running on port ${PORT}`);
  });
});
