"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Product_1 = __importDefault(require("./models/Product"));
dotenv_1.default.config();
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/premiumstore');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
const updateFeatures = async () => {
    try {
        await connectDB();
        const product = await Product_1.default.findOne({ appId: /gemini/i });
        if (product) {
            if (product.plans && product.plans.length > 0) {
                // Find Gemini Ultra plan if multiple, otherwise update the first one
                let ultraPlan = product.plans.find(p => p.planName.toLowerCase().includes('ultra'));
                if (!ultraPlan)
                    ultraPlan = product.plans[0];
                ultraPlan.features = [
                    "5x higher usage limits than Pro plan | Get usage limits that are 5x higher than the Google AI Pro plan",
                    "Higher access to our Pro model | Get the advanced reasoning of our Gemini 3 Pro model for complex maths and coding problems",
                    "Access Deep Think and more features | Get access to our most advanced features like Deep Think"
                ];
                await product.save();
                console.log(`Updated features for Gemini product plan: ${ultraPlan.planName}`);
            }
            else {
                console.log('Gemini product has no plans.');
            }
        }
        else {
            console.log('Gemini product not found in database.');
        }
        process.exit();
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
updateFeatures();
