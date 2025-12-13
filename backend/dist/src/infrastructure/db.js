"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
const connectDB = async () => {
    try {
        const MONGODB_URL = process.env.MONGODB_URL;
        if (!MONGODB_URL) {
            throw new Error('MONGODB_URL is not defined in environment variables');
        }
        await mongoose_1.default.connect(MONGODB_URL);
        console.log('MongoDB connected');
    }
    catch (err) {
        const error = err;
        console.error("Error: " + error.message);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map