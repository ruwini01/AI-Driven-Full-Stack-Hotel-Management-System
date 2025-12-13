"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const db_1 = __importDefault(require("./infrastructure/db"));
const global_error_handling_middleware_1 = __importDefault(require("./api/middleware/global-error-handling-middleware"));
const express_2 = require("@clerk/express");
// Connect DB once — Vercel serverless safe
(0, db_1.default)();
const app = (0, express_1.default)();
exports.app = app;
/* ------------------------------
   CORS CONFIG - ALLOW ALL ORIGINS
   ⚠️ WARNING: Use with caution in production
--------------------------------*/
app.use((0, cors_1.default)({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Alternative: If you want to log which origins are accessing
// app.use(
//   cors({
//     origin(origin, callback) {
//       console.log("✅ Request from origin:", origin || "same-origin");
//       callback(null, true); // Allow all
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );
app.use(express_1.default.json());
app.use((0, express_2.clerkMiddleware)());
/* ------------------------------
   ROUTES
--------------------------------*/
const hotel_1 = __importDefault(require("./api/hotel"));
const review_1 = __importDefault(require("./api/review"));
const location_1 = __importDefault(require("./api/location"));
const booking_1 = __importDefault(require("./api/booking"));
app.use("/api/hotels", hotel_1.default);
app.use("/api/reviews", review_1.default);
app.use("/api/locations", location_1.default);
app.use("/api/bookings", booking_1.default);
// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server running" });
});
// Root route
app.get("/", (req, res) => {
    res.json({
        message: "Hotel Management API",
        status: "running",
        endpoints: {
            health: "/api/health",
            hotels: "/api/hotels",
            reviews: "/api/reviews",
            locations: "/api/locations",
            bookings: "/api/bookings"
        }
    });
});
// Global error middleware
app.use(global_error_handling_middleware_1.default);
/* ------------------------------------
   LOCAL DEVELOPMENT ONLY (NOT VERCEL)
---------------------------------------*/
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
        console.log(`🚀 Local server running at http://localhost:${PORT}`);
    });
}
/* ------------------------------------
   EXPORT FOR VERCEL SERVERLESS
---------------------------------------*/
exports.default = (0, serverless_http_1.default)(app);
//# sourceMappingURL=index.js.map