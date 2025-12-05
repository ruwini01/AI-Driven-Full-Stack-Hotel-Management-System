"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const db_1 = __importDefault(require("./src/infrastructure/db"));
const global_error_handling_middleware_1 = __importDefault(require("./src/api/middleware/global-error-handling-middleware"));
const express_2 = require("@clerk/express");
// Create app
const app = (0, express_1.default)();
/* ------------------------------------
   CONNECT TO DB (Vercel optimized)
--------------------------------------*/
(async () => {
    // Only connects once because of cached logic in db.ts
    await (0, db_1.default)();
})();
/* ------------------------------
   CORS CONFIG (safe version)
--------------------------------*/
const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5174",
    "http://localhost:3000",
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.log("⛔ Blocked by CORS:", origin);
        return callback(null, false); // safer than throwing in serverless
    },
    credentials: true,
}));
app.use(express_1.default.json());
/* ------------------------------------
   CLERK MIDDLEWARE
--------------------------------------*/
app.use((req, res, next) => {
    try {
        return (0, express_2.clerkMiddleware)()(req, res, next);
    }
    catch (err) {
        console.error("Clerk error:", err);
        next();
    }
});
/* ------------------------------
   ROUTES — moved below DB
--------------------------------*/
const hotel_1 = __importDefault(require("./src/api/hotel"));
const review_1 = __importDefault(require("./src/api/review"));
const location_1 = __importDefault(require("./src/api/location"));
const booking_1 = __importDefault(require("./src/api/booking"));
app.use("/api/hotels", hotel_1.default);
app.use("/api/reviews", review_1.default);
app.use("/api/locations", location_1.default);
app.use("/api/bookings", booking_1.default);
// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Server running" });
});
// Global error handler
app.use(global_error_handling_middleware_1.default);
/* ------------------------------------
   EXPORT HANDLER FOR VERCEL
--------------------------------------*/
const handler = (0, serverless_http_1.default)(app);
exports.default = handler;
module.exports = handler;
//# sourceMappingURL=index.js.map