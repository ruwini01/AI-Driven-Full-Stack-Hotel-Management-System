import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async (): Promise<void> => {
    try {
        const MONGODB_URL = process.env.MONGODB_URL;
        if (!MONGODB_URL) {
            throw new Error('MONGODB_URL is not defined in environment variables');
        }
        await mongoose.connect(MONGODB_URL);
        console.log('MongoDB connected');
    } catch (err) {
        const error = err as Error;
        console.error("Error: " + error.message);
    }
};

export default connectDB;