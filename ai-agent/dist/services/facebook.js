"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhookEvent = exports.verifyWebhook = exports.saveFacebookSettings = exports.getFacebookSettings = void 0;
const AgentSetting_1 = __importDefault(require("../models/AgentSetting"));
const aiManager_1 = require("./aiManager");
const getFacebookSettings = async () => {
    const doc = await AgentSetting_1.default.findOne({ key: 'facebook_credentials' });
    return doc ? doc.value : { pageId: '', accessToken: '', verifyToken: '' };
};
exports.getFacebookSettings = getFacebookSettings;
const saveFacebookSettings = async (settings) => {
    await AgentSetting_1.default.findOneAndUpdate({ key: 'facebook_credentials' }, { value: settings }, { upsert: true, new: true });
};
exports.saveFacebookSettings = saveFacebookSettings;
const verifyWebhook = async (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    try {
        const settings = await (0, exports.getFacebookSettings)();
        if (mode === 'subscribe' && token === (settings.verifyToken || 'verify_token_default')) {
            console.log('FB Webhook Verified Successfully');
            res.status(200).send(challenge);
        }
        else {
            res.status(403).send('Forbidden');
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
exports.verifyWebhook = verifyWebhook;
const handleWebhookEvent = async (req, res) => {
    const body = req.body;
    if (body.object === 'page') {
        try {
            const settings = await (0, exports.getFacebookSettings)();
            const accessToken = settings.accessToken;
            if (!accessToken) {
                console.warn('Facebook Page Access Token not configured. Ignoring webhook event.');
                res.status(200).send('EVENT_RECEIVED');
                return;
            }
            // IMPORTANT: Respond 200 OK immediately to prevent Meta from retrying the webhook and causing infinite loops
            res.status(200).send('EVENT_RECEIVED');
            for (const entry of body.entry) {
                if (!entry.messaging)
                    continue;
                for (const event of entry.messaging) {
                    const senderId = event.sender?.id;
                    const messageText = event.message?.text;
                    // Ignore echoes, other events
                    if (!senderId || !messageText || event.message?.is_echo)
                        continue;
                    console.log(`Received FB message from ${senderId}: ${messageText}`);
                    // Process using AI Fallback in the background to not block the webhook
                    (0, aiManager_1.processWithAIFallback)(senderId, messageText)
                        .then(async (reply) => {
                        // Send reply back via Facebook Send API
                        await sendFacebookMessage(senderId, reply, accessToken);
                    })
                        .catch(err => {
                        console.error('Error in background AI processing for FB:', err);
                    });
                }
            }
        }
        catch (err) {
            console.error('Error handling Facebook Webhook event:', err);
            res.status(500).send(err.message);
        }
    }
    else {
        res.status(404).send('Not Found');
    }
};
exports.handleWebhookEvent = handleWebhookEvent;
const sendFacebookMessage = async (recipientId, text, accessToken) => {
    const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${accessToken}`;
    const payload = {
        recipient: { id: recipientId },
        message: { text }
    };
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            const data = await res.json();
            console.error('Meta Graph API error:', data);
        }
    }
    catch (err) {
        console.error('Failed to send Facebook Messenger reply:', err);
    }
};
