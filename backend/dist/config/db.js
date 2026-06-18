"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dns_1 = __importDefault(require("dns"));
// Force public DNS resolution to prevent local SRV query failures (querySrv ECONNREFUSED) in Node.js
try {
    dns_1.default.setServers(['8.8.8.8', '1.1.1.1']);
}
catch (error) {
    console.warn('Failed to set custom DNS servers:', error);
}
// Removed custom DNS to allow default system resolution
const connectDB = async () => {
    try {
        // Disable command buffering so that DB errors fail fast instead of hanging requests
        mongoose_1.default.set('bufferCommands', false);
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Database Connection Warning: ${error.message}`);
        console.warn('Running backend in offline/disconnected mode. Database operations will return errors immediately instead of hanging.');
    }
};
exports.default = connectDB;
