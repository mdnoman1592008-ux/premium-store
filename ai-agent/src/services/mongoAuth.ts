import { proto } from '@whiskeysockets/baileys';
import { AuthenticationState, AuthenticationCreds, BufferJSON, initAuthCreds } from '@whiskeysockets/baileys';
import BaileysAuth from '../models/BaileysAuth';

export const useMongoDBAuthState = async (sessionId: string): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void> }> => {
  const writeData = async (data: any, key: string) => {
    try {
      const serialized = JSON.stringify(data, BufferJSON.replacer);
      await BaileysAuth.findOneAndUpdate(
        { key: `${sessionId}:${key}` },
        { value: serialized },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('BaileysAuth write error:', err);
    }
  };

  const readData = async (key: string) => {
    try {
      const doc = await BaileysAuth.findOne({ key: `${sessionId}:${key}` });
      if (!doc) return null;
      return JSON.parse(doc.value, BufferJSON.reviver);
    } catch (err) {
      console.error('BaileysAuth read error:', err);
      return null;
    }
  };

  const removeData = async (key: string) => {
    try {
      await BaileysAuth.deleteOne({ key: `${sessionId}:${key}` });
    } catch (err) {
      console.error('BaileysAuth remove error:', err);
    }
  };

  const credsKey = 'creds';
  let creds: AuthenticationCreds = await readData(credsKey);
  if (!creds) {
    creds = initAuthCreds();
    await writeData(creds, credsKey);
  }

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data: { [id: string]: any } = {};
          await Promise.all(
            ids.map(async (id) => {
              let value = await readData(`${type}-${id}`);
              if (type === 'app-state-sync-key' && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }
              data[id] = value;
            })
          );
          return data;
        },
        set: async (data) => {
          const tasks: Promise<void>[] = [];
          const dataAny = data as any;
          for (const category in dataAny) {
            for (const id in dataAny[category]) {
              const value = dataAny[category][id];
              const key = `${category}-${id}`;
              if (value) {
                tasks.push(writeData(value, key));
              } else {
                tasks.push(removeData(key));
              }
            }
          }
          await Promise.all(tasks);
        }
      }
    },
    saveCreds: async () => {
      await writeData(creds, credsKey);
    }
  };
};
