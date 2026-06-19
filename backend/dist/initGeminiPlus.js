"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGeminiPlus = void 0;
const Product_1 = __importDefault(require("./models/Product"));
const initGeminiPlus = async () => {
    try {
        const product = await Product_1.default.findOne({ appId: 'gemini' });
        if (product) {
            const hasPlusPlan = product.plans.some(plan => plan.planName.toLowerCase().includes('plus'));
            if (!hasPlusPlan) {
                console.log('Gemini Plus plan not found in database. Initializing Google AI Plus plan...');
                const defaultDurations = [
                    { months: 1, label: '1 Month', price: 0, discount: 0, saved: 0, tag: 'Standard' },
                    { months: 3, label: '3 Months', price: 0, discount: 0, saved: 0, tag: 'Popular' },
                    { months: 6, label: '6 Months', price: 0, discount: 0, saved: 0, tag: 'Value' },
                    { months: 12, label: '12 Months', price: 0, discount: 0, saved: 0, tag: 'Best Deal' }
                ];
                product.plans.push({
                    planName: 'Google AI Plus',
                    description: 'Get more access to AI tools to boost your productivity and creativity',
                    features: [
                        "2x higher usage limits | Get usage limits that are 2x higher than without a Google AI plan",
                        "Access to our Flash Thinking model | Get the speed and intelligence of our Gemini 3 Flash Thinking model for complex problems"
                    ],
                    durations: defaultDurations
                });
                await product.save();
                console.log('Google AI Plus plan initialized successfully in database.');
            }
            else {
                console.log('Gemini Plus plan already exists in database.');
            }
        }
        else {
            console.log('Gemini product not found in database, skipping Gemini Plus initialization.');
        }
    }
    catch (error) {
        console.error('Error initializing Gemini Plus plan:', error);
    }
};
exports.initGeminiPlus = initGeminiPlus;
