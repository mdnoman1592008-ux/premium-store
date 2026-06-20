"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("./config/db"));
const Admin_1 = __importDefault(require("./models/Admin"));
const BaileysAuth_1 = __importDefault(require("./models/BaileysAuth"));
const whatsapp_1 = require("./services/whatsapp");
const facebook_1 = require("./services/facebook");
const aiManager_1 = require("./services/aiManager");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Admin token protection middleware
// We just verify the JWT signature — the token was already issued by the trusted backend
const adminProtect = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        const token = req.headers.authorization.split(' ')[1];
        try {
            const secret = process.env.JWT_SECRET || 'supersecretjwtkey123';
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            if (decoded && decoded.id) {
                req.admin = { id: decoded.id };
                next();
            }
            else {
                res.status(401).json({ message: 'Invalid token payload' });
            }
        }
        catch (error) {
            res.status(401).json({ message: `Not authorized: ${error.message}` });
        }
    }
    else {
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
        const admin = await Admin_1.default.findOne({ username });
        if (admin && await admin.matchPassword(password)) {
            const secret = process.env.JWT_SECRET || 'supersecretjwtkey123';
            const token = jsonwebtoken_1.default.sign({ id: admin._id }, secret, { expiresIn: '30d' });
            res.json({ token, username: admin.username });
        }
        else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// --- WhatsApp Admin Endpoints ---
// Get current WhatsApp JID connection status and QR code
app.get('/api/agent/whatsapp/status', adminProtect, (req, res) => {
    const status = (0, whatsapp_1.getWhatsAppStatus)();
    res.json(status);
});
// Initialize / Connect WhatsApp
app.post('/api/agent/whatsapp/connect', adminProtect, async (req, res) => {
    try {
        await (0, whatsapp_1.connectWhatsApp)();
        res.json({ message: 'WhatsApp initialization started' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Disconnect / Log out from WhatsApp
app.post('/api/agent/whatsapp/disconnect', adminProtect, async (req, res) => {
    try {
        await (0, whatsapp_1.disconnectWhatsApp)();
        res.json({ message: 'WhatsApp disconnected successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Hard Reset: kill socket + wipe ALL session data from MongoDB
app.post('/api/agent/whatsapp/reset', adminProtect, async (req, res) => {
    try {
        await (0, whatsapp_1.resetWhatsAppSession)();
        res.json({ message: 'WhatsApp session fully reset. You can now scan QR or use pairing code.' });
    }
    catch (err) {
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
        const code = await (0, whatsapp_1.getPairingCode)(phone);
        res.json({ pairingCode: code });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// --- Facebook Messenger Endpoints ---
// Fetch Facebook credentials settings
app.get('/api/agent/facebook/settings', adminProtect, async (req, res) => {
    try {
        const settings = await (0, facebook_1.getFacebookSettings)();
        res.json(settings);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Update / Save Facebook settings
app.post('/api/agent/facebook/settings', adminProtect, async (req, res) => {
    const { pageId, accessToken, verifyToken } = req.body;
    try {
        await (0, facebook_1.saveFacebookSettings)({ pageId, accessToken, verifyToken });
        res.json({ message: 'Facebook Messenger settings updated successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Facebook Webhook Verify Endpoint (GET)
app.get('/api/agent/facebook/webhook', facebook_1.verifyWebhook);
// Facebook Webhook Event Handler (POST)
app.post('/api/agent/facebook/webhook', facebook_1.handleWebhookEvent);
// --- Website Chatbot Endpoints ---
// Public chat route for storefront chat widget
app.post('/api/agent/web/chat', async (req, res) => {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
        res.status(400).json({ message: 'sessionId and message are required' });
        return;
    }
    try {
        const reply = await (0, aiManager_1.processWithAIFallback)(sessionId, message);
        res.json({ reply });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Default root route
app.get('/', (req, res) => {
    res.send('AI Agent Service API is running...');
});
// Endpoint to check available Gemini models
app.get('/api/agent/models', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey)
            return res.status(500).json({ error: 'GEMINI_API_KEY is missing in Railway environment variables.' });
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        const models = data.models ? data.models.map((m) => m.name.replace('models/', '')) : data;
        res.json({ availableModels: models, raw: data });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
const PORT = process.env.PORT || 5001;
// Start Server and Database Connection
(0, db_1.default)().then(async () => {
    app.listen(PORT, () => {
        console.log(`AI Agent server running on port ${PORT}`);
    });
    // Auto-reconnect WhatsApp if a session exists in the database
    try {
        const authDocs = await BaileysAuth_1.default.countDocuments({ key: { $regex: '^session_whatsapp:' } });
        console.log(`Checking BaileysAuth on startup: Found ${authDocs} session documents.`);
        if (authDocs > 0) {
            console.log('Existing WhatsApp session found. Auto-connecting...');
            (0, whatsapp_1.connectWhatsApp)();
        }
        else {
            console.log('No WhatsApp session found on startup. Waiting for admin to connect manually.');
        }
    }
    catch (err) {
        console.error('Failed to check WhatsApp session on startup:', err);
    }
});
