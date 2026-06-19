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
const updateLogo = async () => {
    try {
        await connectDB();
        const product = await Product_1.default.findOne({ $or: [{ appId: /nordvpn/i }, { appName: /nord/i }] });
        if (product) {
            product.logo = '/nordvpn_icon.png';
            await product.save();
            console.log(`Updated logo for product: ${product.appName}`);
        }
        else {
            console.log('NordVPN product not found in database.');
        }
        process.exit();
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
updateLogo();
