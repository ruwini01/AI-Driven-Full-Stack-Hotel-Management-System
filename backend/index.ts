import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import serverless from 'serverless-http';
import connectDB from './src/infrastructure/db';
import globalErrorHandlingMiddleware from './src/api/middleware/global-error-handling-middleware';
import { clerkMiddleware } from '@clerk/express';

// Connect to database
connectDB();

const app = express();

// Dynamic CORS configuration - allows same domain
const allowedOrigins: string[] = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        'http://localhost:5174',
        'http://localhost:3000'
    ].filter((origin): origin is string => Boolean(origin));

app.use(cors({
    origin: function(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        // Allow requests with no origin (same domain, mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(clerkMiddleware());

// Routes
import hotelRoute from './src/api/hotel';
import reviewRoute from './src/api/review';
import locationRoute from './src/api/location';

app.use('/api/hotels', hotelRoute);
app.use('/api/reviews', reviewRoute);
app.use('/api/locations', locationRoute);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Global error handler
app.use(globalErrorHandlingMiddleware);

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel serverless
export default serverless(app);
export { app };