"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMongoDBAuthState = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
const baileys_2 = require("@whiskeysockets/baileys");
const BaileysAuth_1 = __importDefault(require("../models/BaileysAuth"));
const useMongoDBAuthState = async (sessionId) => {
    const writeData = async (data, key) => {
        try {
            const serialized = JSON.stringify(data, baileys_2.BufferJSON.replacer);
            await BaileysAuth_1.default.findOneAndUpdate({ key: `${sessionId}:${key}` }, { value: serialized }, { upsert: true, new: true });
        }
        catch (err) {
            console.error('BaileysAuth write error:', err);
        }
    };
    const readData = async (key) => {
        try {
            const doc = await BaileysAuth_1.default.findOne({ key: `${sessionId}:${key}` });
            if (!doc)
                return null;
            return JSON.parse(doc.value, baileys_2.BufferJSON.reviver);
        }
        catch (err) {
            console.error('BaileysAuth read error:', err);
            return null;
        }
    };
    const removeData = async (key) => {
        try {
            await BaileysAuth_1.default.deleteOne({ key: `${sessionId}:${key}` });
        }
        catch (err) {
            console.error('BaileysAuth remove error:', err);
        }
    };
    const credsKey = 'creds';
    let creds = await readData(credsKey);
    if (!creds) {
        creds = (0, baileys_2.initAuthCreds)();
        await writeData(creds, credsKey);
    }
    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(ids.map(async (id) => {
                        let value = await readData(`${type}-${id}`);
                        if (type === 'app-state-sync-key' && value) {
                            value = baileys_1.proto.Message.AppStateSyncKeyData.fromObject(value);
                        }
                        data[id] = value;
                    }));
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    const dataAny = data;
                    for (const category in dataAny) {
                        for (const id in dataAny[category]) {
                            const value = dataAny[category][id];
                            const key = `${category}-${id}`;
                            if (value) {
                                tasks.push(writeData(value, key));
                            }
                            else {
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
exports.useMongoDBAuthState = useMongoDBAuthState;
