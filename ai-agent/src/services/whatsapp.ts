import makeWASocket, { DisconnectReason } from '@whiskeysockets/baileys';
import { useMongoDBAuthState } from './mongoAuth';
import { chatWithAgent } from './gemini';
import qrcode from 'qrcode';
import pino from 'pino';

let sock: any = null;
let connectionStatus = 'Disconnected';
let qrCodeImage = '';
let pairingCode = '';

export const getWhatsAppStatus = () => {
  return {
    status: connectionStatus,
    qrCode: qrCodeImage,
    pairingCode: pairingCode
  };
};

export const disconnectWhatsApp = async () => {
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

  // Clear auth session from database
  try {
    const BaileysAuth = (await import('../models/BaileysAuth')).default;
    await BaileysAuth.deleteMany({ key: { $regex: '^session_whatsapp:' } });
    console.log('Cleared BaileysAuth session from database.');
  } catch (err) {
    console.error('Failed to clear session from database:', err);
  }
};

const initWhatsAppSocket = async (printQR: boolean = true) => {
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

      console.log(`WhatsApp connection update: connection = ${connection}, qr = ${qr ? 'present' : 'absent'}`);

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
        console.error(`WhatsApp connection closed. Status Code: ${statusCode}, Error:`, error);
        if (error?.stack) {
          console.error(error.stack);
        }

        const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
        console.log('WhatsApp connection closed. Should reconnect:', shouldReconnect);
        connectionStatus = 'Disconnected';
        qrCodeImage = '';
        pairingCode = '';
        sock = null;

        if (shouldReconnect) {
          // Wait 5 seconds and reconnect
          console.log('Scheduling reconnection in 5 seconds...');
          setTimeout(() => connectWhatsApp(), 5000);
        }
      } else if (connection === 'open') {
        connectionStatus = 'Connected';
        qrCodeImage = '';
        pairingCode = '';
        console.log('WhatsApp connection opened successfully!');
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

        const messageText = msg.message.conversation || 
                            msg.message.extendedTextMessage?.text || 
                            '';

        if (!messageText.trim()) continue;

        try {
          // Send typing indicator
          await sock.sendPresenceUpdate('composing', fromJid);

          // Generate AI reply
          const reply = await chatWithAgent(fromJid, messageText);

          // Remove typing indicator
          await sock.sendPresenceUpdate('paused', fromJid);

          // Send message back
          await sock.sendMessage(fromJid, { text: reply });
        } catch (err) {
          console.error('Error handling WhatsApp message:', err);
        }
      }
    });
  } catch (err) {
    console.error('Failed to initialize WhatsApp socket:', err);
    connectionStatus = 'Disconnected';
  }
};

export const getPairingCode = async (phoneNumber: string) => {
  if (connectionStatus === 'Connected') {
    throw new Error('Already connected');
  }

  // Force socket reset
  if (sock) {
    sock.end();
    sock = null;
  }

  await initWhatsAppSocket(false);

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
  } else {
    throw new Error('Already registered or initialization failed');
  }
};

export const connectWhatsApp = async () => {
  await initWhatsAppSocket(true);
};
