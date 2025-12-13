"use strict";
// File: backend/src/api/bookings-router.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const booking_1 = __importDefault(require("../application/booking"));
const authentication_middleware_1 = __importDefault(require("./middleware/authentication-middleware"));
const bookingsRouter = express_1.default.Router();
// Optional logging middleware
const preMiddleware = (req, res, next) => {
    console.log(req.method, req.url);
    next();
};
bookingsRouter.use(preMiddleware);
// All booking routes require authentication
bookingsRouter.use(authentication_middleware_1.default);
bookingsRouter.post("/add", booking_1.default.addBooking);
bookingsRouter.get("/user/:userId", booking_1.default.getUserBookings);
bookingsRouter.get("/user/:userId/stats", booking_1.default.getBookingStats);
bookingsRouter.get("/:bookingId", booking_1.default.getBookingById);
bookingsRouter.patch("/:bookingId/cancel", booking_1.default.cancelBooking);
exports.default = bookingsRouter;
//# sourceMappingURL=booking.js.map