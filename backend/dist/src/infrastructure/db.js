"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
const connectDB = async () => {
    if (cached.conn) {
        return cached.conn; // Use existing connection
    }
    if (!cached.promise) {
        const MONGODB_URL = process.env.MONGODB_URL;
        if (!MONGODB_URL) {
            throw new Error("MONGODB_URL is not defined in environment variables");
        }
        cached.promise = mongoose_1.default
            .connect(MONGODB_URL)
            .then((mongoose) => {
            console.log("MongoDB connected (cached)");
            return mongoose;
        })
            .catch((err) => {
            console.error("MongoDB connection error:", err);
            throw err;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map