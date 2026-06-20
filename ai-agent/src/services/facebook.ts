import AgentSetting from '../models/AgentSetting';
import { processWithAIFallback } from './aiManager';
import { processLocalBrain } from '../ai_brain';

export const getFacebookSettings = async () => {
  const doc = await AgentSetting.findOne({ key: 'facebook_credentials' });
  return doc ? doc.value : { pageId: '', accessToken: '', verifyToken: '' };
};

export const saveFacebookSettings = async (settings: { pageId: string; accessToken: string; verifyToken: string }) => {
  await AgentSetting.findOneAndUpdate(
    { key: 'facebook_credentials' },
    { value: settings },
    { upsert: true, new: true }
  );
};

export const verifyWebhook = async (req: any, res: any) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  try {
    const settings = await getFacebookSettings();
    if (mode === 'subscribe' && token === (settings.verifyToken || 'verify_token_default')) {
      console.log('FB Webhook Verified Successfully');
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Forbidden');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};

export const handleWebhookEvent = async (req: any, res: any) => {
  const body = req.body;

  if (body.object === 'page') {
    try {
      const settings = await getFacebookSettings();
      const accessToken = settings.accessToken;

      if (!accessToken) {
        console.warn('Facebook Page Access Token not configured. Ignoring webhook event.');
        res.status(200).send('EVENT_RECEIVED');
        return;
      }

      for (const entry of body.entry) {
        if (!entry.messaging) continue;
        for (const event of entry.messaging) {
          const senderId = event.sender?.id;
          const messageText = event.message?.text;

          // Ignore echoes, other events
          if (!senderId || !messageText || event.message?.is_echo) continue;

          console.log(`Received FB message from ${senderId}: ${messageText}`);

          // Process using Local AI Brain first, fallback to API
          let reply = processLocalBrain(messageText);
          if (!reply) {
            reply = await processWithAIFallback(senderId, messageText);
          }

          // Send reply back via Facebook Send API
          await sendFacebookMessage(senderId, reply, accessToken);
        }
      }
      res.status(200).send('EVENT_RECEIVED');
    } catch (err: any) {
      console.error('Error handling Facebook Webhook event:', err);
      res.status(500).send(err.message);
    }
  } else {
    res.status(404).send('Not Found');
  }
};

const sendFacebookMessage = async (recipientId: string, text: string, accessToken: string) => {
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
  } catch (err) {
    console.error('Failed to send Facebook Messenger reply:', err);
  }
};
