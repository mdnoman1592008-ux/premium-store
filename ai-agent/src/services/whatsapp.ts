import makeWASocket, { DisconnectReason } from '@whiskeysockets/baileys';
import { useMongoDBAuthState } from './mongoAuth';
import { chatWithAgent } from './gemini';
import qrcode from 'qrcode';
import pino from 'pino';
import BaileysAuth from '../models/BaileysAuth';

let sock: any = null;
let connectionStatus = 'Disconnected';
let qrCodeImage = '';
let pairingCode = '';
let reconnectAttempts = 0;
let reconnectTimer: any = null;
const MAX_RECONNECT_ATTEMPTS = 5;

export const getWhatsAppStatus = () => {
  return {
    status: connectionStatus,
    qrCode: qrCodeImage,
    pairingCode: pairingCode,
    reconnectAttempts
  };
};

// Hard reset: clear socket AND all MongoDB session data
export const resetWhatsAppSession = async () => {
  // Cancel any pending reconnect
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  // Forcefully end the socket
  if (sock) {
    try { sock.end(); } catch (e) {}
    sock = null;
  }

  connectionStatus = 'Disconnected';
  qrCodeImage = '';
  pairingCode = '';
  reconnectAttempts = 0;

  // Wipe session from MongoDB
  try {
    const deleted = await BaileysAuth.deleteMany({ key: { $regex: '^session_whatsapp:' } });
    console.log(`Session reset: deleted ${deleted.deletedCount} BaileysAuth documents.`);
  } catch (err) {
    console.error('Failed to clear session from database:', err);
  }
};

export const disconnectWhatsApp = async () => {
  // Cancel any pending reconnect
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  if (sock) {
    try {
      await sock.logout();
      sock.end();
    } catch (e) {}
    sock = null;
  }

  connectionStatus = 'Disconnected';
  qrCodeImage = '';
  pairingCode = '';
  reconnectAttempts = 0;

  // Clear auth session from database
  try {
    const deleted = await BaileysAuth.deleteMany({ key: { $regex: '^session_whatsapp:' } });
    console.log(`Disconnect: cleared ${deleted.deletedCount} BaileysAuth session documents.`);
  } catch (err) {
    console.error('Failed to clear session from database:', err);
  }
};

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
    connectWhatsApp();
  }, delay);
};

const initWhatsAppSocket = async () => {
  if (sock) return;

  connectionStatus = 'Connecting';
  console.log('Initializing WhatsApp socket...');

  try {
    const { state, saveCreds } = await useMongoDBAuthState('session_whatsapp');

    sock = makeWASocket({
      auth: state,
      logger: pino({ level: 'silent' }) as any
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update: any) => {
      const { connection, lastDisconnect, qr } = update;
      console.log(`WhatsApp connection.update: connection=${connection}, qr=${qr ? 'present' : 'absent'}`);

      if (qr) {
        connectionStatus = 'Scanning';
        try {
          qrCodeImage = await qrcode.toDataURL(qr);
        } catch (err) {
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
        const isLoggedOut = statusCode === DisconnectReason.loggedOut;
        const isBadSession = statusCode === 500; // Baileys BadSession

        if (isLoggedOut || isBadSession) {
          console.error('WhatsApp session is invalid/logged-out. Manual reconnect required.');
          // Auto-clear bad session from DB
          try {
            await BaileysAuth.deleteMany({ key: { $regex: '^session_whatsapp:' } });
            console.log('Auto-cleared bad session from database.');
          } catch (err) {
            console.error('Failed to auto-clear bad session:', err);
          }
        } else {
          scheduleReconnect();
        }
      } else if (connection === 'open') {
        connectionStatus = 'Connected';
        qrCodeImage = '';
        pairingCode = '';
        reconnectAttempts = 0; // reset on successful connection
        console.log('WhatsApp connected successfully!');
      }
    });

    sock.ev.on('messages.upsert', async (m: any) => {
      if (m.type !== 'notify') return;

      for (const msg of m.messages) {
        if (!msg.message) continue;
        const fromJid = msg.key.remoteJid;
        if (!fromJid) continue;
        const isGroup = fromJid.endsWith('@g.us');
        const isMe = msg.key.fromMe;
        if (isGroup || isMe) continue;

        const messageText =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          '';
        if (!messageText.trim()) continue;

        try {
          await sock.sendPresenceUpdate('composing', fromJid);
          const reply = await chatWithAgent(fromJid, messageText);
          await sock.sendPresenceUpdate('paused', fromJid);
          await sock.sendMessage(fromJid, { text: reply });
        } catch (err) {
          console.error('Error handling WhatsApp message:', err);
        }
      }
    });
  } catch (err) {
    console.error('Failed to initialize WhatsApp socket:', err);
    connectionStatus = 'Disconnected';
    sock = null;
  }
};

export const getPairingCode = async (phoneNumber: string) => {
  if (connectionStatus === 'Connected') {
    throw new Error('Already connected. Disconnect first to re-link.');
  }

  // Force socket reset
  if (sock) {
    try { sock.end(); } catch (e) {}
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
    } catch (err: any) {
      console.error('Failed to request pairing code:', err);
      throw new Error(`Failed to request pairing code: ${err.message}`);
    }
  } else if (sock?.authState?.creds?.registered) {
    throw new Error('Session already registered. Reset the session first to re-link a new number.');
  } else {
    throw new Error('Socket initialization failed. Try resetting the session first.');
  }
};

export const connectWhatsApp = async () => {
  await initWhatsAppSocket();
};
