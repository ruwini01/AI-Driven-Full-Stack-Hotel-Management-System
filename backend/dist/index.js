"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const db_1 = __importDefault(require("./src/infrastructure/db"));
const global_error_handling_middleware_1 = __importDefault(require("./src/api/middleware/global-error-handling-middleware"));
const express_2 = require("@clerk/express");
// Connect to database
(0, db_1.default)();
const app = (0, express_1.default)();
exports.app = app;
// Dynamic CORS configuration - allows same domain
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
        'http://localhost:5174',
        'http://localhost:3000'
    ].filter((origin) => Boolean(origin));
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (same domain, mobile apps, Postman, etc.)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, express_2.clerkMiddleware)());
// Routes
const hotel_1 = __importDefault(require("./src/api/hotel"));
const review_1 = __importDefault(require("./src/api/review"));
const location_1 = __importDefault(require("./src/api/location"));
const booking_1 = __importDefault(require("./src/api/booking"));
app.use('/api/hotels', hotel_1.default);
app.use('/api/reviews', review_1.default);
app.use('/api/locations', location_1.default);
app.use('/api/bookings', booking_1.default);
// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});
// Global error handler
app.use(global_error_handling_middleware_1.default);
// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
// Export for Vercel serverless
exports.default = (0, serverless_http_1.default)(app);
//# sourceMappingURL=index.js.map