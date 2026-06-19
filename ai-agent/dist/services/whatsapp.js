"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectWhatsApp = exports.getPairingCode = exports.disconnectWhatsApp = exports.resetWhatsAppSession = exports.getWhatsAppStatus = void 0;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const mongoAuth_1 = require("./mongoAuth");
const gemini_1 = require("./gemini");
const qrcode_1 = __importDefault(require("qrcode"));
const pino_1 = __importDefault(require("pino"));
const BaileysAuth_1 = __importDefault(require("../models/BaileysAuth"));
let sock = null;
let connectionStatus = 'Disconnected';
let qrCodeImage = '';
let pairingCode = '';
let reconnectAttempts = 0;
let reconnectTimer = null;
let initError = '';
const MAX_RECONNECT_ATTEMPTS = 5;
const getWhatsAppStatus = () => {
    return {
        status: connectionStatus,
        qrCode: qrCodeImage,
        pairingCode: pairingCode,
        reconnectAttempts
    };
};
exports.getWhatsAppStatus = getWhatsAppStatus;
// Hard reset: clear socket AND all MongoDB session data
const resetWhatsAppSession = async () => {
    // Cancel any pending reconnect
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    // Forcefully end the socket
    if (sock) {
        try {
            sock.end();
        }
        catch (e) { }
        sock = null;
    }
    connectionStatus = 'Disconnected';
    qrCodeImage = '';
    pairingCode = '';
    reconnectAttempts = 0;
    // Wipe session from MongoDB
    try {
        const deleted = await BaileysAuth_1.default.deleteMany({ key: { $regex: '^session_whatsapp:' } });
        console.log(`Session reset: deleted ${deleted.deletedCount} BaileysAuth documents.`);
    }
    catch (err) {
        console.error('Failed to clear session from database:', err);
    }
};
exports.resetWhatsAppSession = resetWhatsAppSession;
const disconnectWhatsApp = async () => {
    // Cancel any pending reconnect
    if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
    }
    if (sock) {
        try {
            await sock.logout();
            sock.end();
        }
        catch (e) { }
        sock = null;
    }
    connectionStatus = 'Disconnected';
    qrCodeImage = '';
    pairingCode = '';
    reconnectAttempts = 0;
    // Clear auth session from database
    try {
        const deleted = await BaileysAuth_1.default.deleteMany({ key: { $regex: '^session_whatsapp:' } });
        console.log(`Disconnect: cleared ${deleted.deletedCount} BaileysAuth session documents.`);
    }
    catch (err) {
        console.error('Failed to clear session from database:', err);
    }
};
exports.disconnectWhatsApp = disconnectWhatsApp;
const scheduleReconnect = () => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.error(`WhatsApp: reached max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}). Stopping.`);
        connectionStatus = 'Disconnected';
        return;
    }
    reconnectAttempts++;
    // Exponential backoff: 5s, 10s, 20s, 40s, 80s
    const delay = Math.min(5000 * Math.pow(2, reconnectAttempts - 1), 60000);
    console.log(`WhatsApp: scheduling reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${delay / 1000}s...`);
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        (0, exports.connectWhatsApp)();
    }, delay);
};
const initWhatsAppSocket = async () => {
    if (sock)
        return;
    connectionStatus = 'Connecting';
    console.log('Initializing WhatsApp socket...');
    try {
        const { state, saveCreds } = await (0, mongoAuth_1.useMongoDBAuthState)('session_whatsapp');
        sock = (0, baileys_1.default)({
            auth: state,
            logger: (0, pino_1.default)({ level: 'silent' }),
            browser: ['Ubuntu', 'Chrome', '110.0.5481.77'],
            syncFullHistory: false
        });
        sock.ev.on('creds.update', saveCreds);
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            console.log(`WhatsApp connection.update: connection=${connection}, qr=${qr ? 'present' : 'absent'}`);
            if (qr) {
                connectionStatus = 'Scanning';
                try {
                    qrCodeImage = await qrcode_1.default.toDataURL(qr);
                }
                catch (err) {
                    console.error('Failed to generate QR data URL:', err);
                }
            }
            if (connection === 'close') {
                const error = lastDisconnect?.error;
                const statusCode = error?.output?.statusCode;
                console.error(`WhatsApp closed. StatusCode=${statusCode}, Error:`, error?.message || error);
                connectionStatus = 'Disconnected';
                qrCodeImage = '';
                pairingCode = '';
                sock = null;
                // 401 = logged out, 428 = restart required — never auto-reconnect on bad session
                const isLoggedOut = statusCode === baileys_1.DisconnectReason.loggedOut;
                const isBadSession = statusCode === 500; // Baileys BadSession
                if (isLoggedOut || isBadSession) {
                    console.error('WhatsApp session is invalid/logged-out. Manual reconnect required.');
                    // Auto-clear bad session from DB
                    try {
                        await BaileysAuth_1.default.deleteMany({ key: { $regex: '^session_whatsapp:' } });
                        console.log('Auto-cleared bad session from database.');
                    }
                    catch (err) {
                        console.error('Failed to auto-clear bad session:', err);
                    }
                }
                else {
                    scheduleReconnect();
                }
            }
            else if (connection === 'open') {
                connectionStatus = 'Connected';
                qrCodeImage = '';
                pairingCode = '';
                reconnectAttempts = 0; // reset on successful connection
                console.log('WhatsApp connected successfully!');
            }
        });
        sock.ev.on('messages.upsert', async (m) => {
            if (m.type !== 'notify')
                return;
            for (const msg of m.messages) {
                if (!msg.message)
                    continue;
                const fromJid = msg.key.remoteJid;
                if (!fromJid)
                    continue;
                const isGroup = fromJid.endsWith('@g.us');
                const isMe = msg.key.fromMe;
                if (isGroup || isMe)
                    continue;
                const messageText = msg.message.conversation ||
                    msg.message.extendedTextMessage?.text ||
                    '';
                if (!messageText.trim())
                    continue;
                try {
                    await sock.sendPresenceUpdate('composing', fromJid);
                    const reply = await (0, gemini_1.chatWithAgent)(fromJid, messageText);
                    await sock.sendPresenceUpdate('paused', fromJid);
                    await sock.sendMessage(fromJid, { text: reply });
                }
                catch (err) {
                    console.error('Error handling WhatsApp message:', err);
                }
            }
        });
    }
    catch (err) {
        console.error('Failed to initialize WhatsApp socket:', err);
        connectionStatus = 'Disconnected';
        sock = null;
        initError = err.message || String(err);
    }
};
const getPairingCode = async (phoneNumber) => {
    if (connectionStatus === 'Connected') {
        throw new Error('Already connected. Disconnect first to re-link.');
    }
    // Force socket reset
    if (sock) {
        try {
            sock.end();
        }
        catch (e) { }
        sock = null;
    }
    await initWhatsAppSocket();
    // Wait up to 3s for socket to be ready
    await new Promise(res => setTimeout(res, 3000));
    if (sock && !sock.authState.creds.registered) {
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        try {
            const code = await sock.requestPairingCode(cleanNumber);
            pairingCode = code;
            connectionStatus = 'Connecting';
            return code;
        }
        catch (err) {
            console.error('Failed to request pairing code:', err);
            throw new Error(`Failed to request pairing code: ${err.message}`);
        }
    }
    else if (sock?.authState?.creds?.registered) {
        throw new Error('Session already registered. Reset the session first to re-link a new number.');
    }
    else {
        throw new Error(`Socket initialization failed. Try resetting the session first. Details: ${initError}`);
    }
};
exports.getPairingCode = getPairingCode;
const connectWhatsApp = async () => {
    await initWhatsAppSocket();
    if (!sock) {
        throw new Error(`Socket initialization failed. Details: ${initError}`);
    }
};
exports.connectWhatsApp = connectWhatsApp;
