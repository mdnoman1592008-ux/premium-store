"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const Product_1 = __importDefault(require("./models/Product"));
const Admin_1 = __importDefault(require("./models/Admin"));
dotenv_1.default.config();
const products = [
    {
        appId: 'chatgpt',
        appName: 'ChatGPT',
        category: 'AI Tools',
        plans: [
            { planName: 'ChatGPT Plus', description: 'Access to GPT-5.5, faster response speed', features: ['Advanced AI', 'Fast Response', 'DALL-E Image Generation'] },
            { planName: 'ChatGPT Pro', description: 'Highest priority access, new features early', features: ['Priority Access', 'Advanced Data Analysis', 'More usage limits'] }
        ]
    },
    {
        appId: 'gemini',
        appName: 'Gemini',
        category: 'AI Tools',
        plans: [
            { planName: 'Gemini Pro', description: 'Advanced reasoning and coding', features: ['Advanced coding capabilities', 'Integration with Google Workspace'] },
            { planName: 'Gemini Ultra', description: 'Most capable model for highly complex tasks', features: ['Highest capability', 'Complex task solving'] }
        ]
    },
    {
        appId: 'grok',
        appName: 'Grok',
        category: 'AI Tools',
        plans: [
            { planName: 'SuperGrok', description: 'Real-time access to X data', features: ['Real-time knowledge', 'Fun mode'] },
            { planName: 'SuperGrok Heavy', description: 'Enhanced compute and deeper context', features: ['Deeper context window', 'Priority processing'] }
        ]
    },
    {
        appId: 'veo',
        appName: 'Veo',
        category: 'Video Generation',
        plans: [
            { planName: 'Veo 3.1 Fast', description: 'Quick video generation', features: ['Fast rendering', 'Standard resolution'] },
            { planName: 'Veo 3.1 Ultra', description: 'High quality video generation', features: ['4K resolution', 'Longer videos'] }
        ]
    },
    {
        appId: 'spotify',
        appName: 'Spotify',
        category: 'Streaming',
        plans: [
            { planName: 'Spotify Premium', description: 'Ad-free music listening', features: ['Ad-free', 'Offline playback', 'High audio quality'] }
        ]
    },
    {
        appId: 'youtube',
        appName: 'YouTube',
        category: 'Streaming',
        plans: [
            { planName: 'YouTube Premium', description: 'Ad-free videos and YouTube Music', features: ['Ad-free videos', 'Background play', 'YouTube Music included'] }
        ]
    },
    {
        appId: 'claude',
        appName: 'Claude',
        category: 'AI Tools',
        plans: [
            { planName: 'Claude Pro', description: 'More usage for Claude 3 Opus', features: ['Access to Opus', 'Early access to features'] },
            { planName: 'Claude Max', description: 'Highest usage limits', features: ['Maximum context window', 'Highest usage limit'] }
        ]
    },
    {
        appId: 'inshot',
        appName: 'InShot',
        category: 'Video Editing',
        plans: [
            { planName: 'InShot Pro', description: 'All effects, filters and stickers', features: ['No watermark', 'All premium assets', 'Ad-free'] }
        ]
    },
    {
        appId: 'capcut',
        appName: 'CapCut',
        category: 'Video Editing',
        plans: [
            { planName: 'CapCut Pro', description: 'Unlock advanced editing features', features: ['Advanced templates', 'Cloud storage', 'Premium effects'] }
        ]
    }
];
const importData = async () => {
    try {
        await Product_1.default.deleteMany();
        await Admin_1.default.deleteMany();
        await Product_1.default.insertMany(products);
        const adminUser = new Admin_1.default({
            username: 'admin',
            password: 'password123'
        });
        await adminUser.save();
        console.log('Data Imported!');
        process.exit();
    }
    catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};
const run = async () => {
    await (0, db_1.default)();
    await importData();
};
run();
