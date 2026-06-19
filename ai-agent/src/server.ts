import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import connectDB from './config/db';
import Admin from './models/Admin';
import BaileysAuth from './models/BaileysAuth';
import {
  connectWhatsApp,
  disconnectWhatsApp,
  resetWhatsAppSession,
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
// We just verify the JWT signature — the token was already issued by the trusted backend
const adminProtect = (req: any, res: any, next: any) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const secret = process.env.JWT_SECRET || 'supersecretjwtkey123';
      const decoded: any = jwt.verify(token, secret);
      if (decoded && decoded.id) {
        req.admin = { id: decoded.id };
        next();
      } else {
        res.status(401).json({ message: 'Invalid token payload' });
      }
    } catch (error: any) {
      res.status(401).json({ message: `Not authorized: ${error.message}` });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// --- AI Agent Admin Login (independent from backend JWT) ---
// Public endpoint: admin logs in here to get an ai-agent specific JWT
app.post('/api/agent/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password required' });
    return;
  }
  try {
    const admin = await Admin.findOne({ username });
    if (admin && await (admin as any).matchPassword(password)) {
      const secret = process.env.JWT_SECRET || 'supersecretjwtkey123';
      const token = jwt.sign({ id: (admin as any)._id }, secret, { expiresIn: '30d' });
      res.json({ token, username: admin.username });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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

// Hard Reset: kill socket + wipe ALL session data from MongoDB
app.post('/api/agent/whatsapp/reset', adminProtect, async (req, res) => {
  try {
    await resetWhatsAppSession();
    res.json({ message: 'WhatsApp session fully reset. You can now scan QR or use pairing code.' });
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
connectDB().then(async () => {
  app.listen(PORT, () => {
    console.log(`AI Agent server running on port ${PORT}`);
  });

  // Auto-reconnect WhatsApp if a session exists in the database
  try {
    const sessionExists = await BaileysAuth.exists({ key: { $regex: '^session_whatsapp:' } });
    if (sessionExists) {
      console.log('Found existing WhatsApp session in database. Auto-connecting...');
      connectWhatsApp();
    }
  } catch (err) {
    console.error('Failed to check WhatsApp session on startup:', err);
  }
});
