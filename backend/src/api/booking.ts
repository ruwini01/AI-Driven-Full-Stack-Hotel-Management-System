// File: backend/src/api/bookings-router.ts

import express, { Request, Response, NextFunction } from "express";
import bookingController from "../application/booking";
import isAuthenticated from "./middleware/authentication-middleware";

const bookingsRouter = express.Router();

// Optional logging middleware
const preMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.method, req.url);
  next();
};

bookingsRouter.use(preMiddleware);

// All booking routes require authentication
bookingsRouter.use(isAuthenticated);



bookingsRouter.post("/add", bookingController.addBooking);


bookingsRouter.get("/user/:userId", bookingController.getUserBookings);


bookingsRouter.get("/user/:userId/stats", bookingController.getBookingStats);


bookingsRouter.get("/:bookingId", bookingController.getBookingById);


bookingsRouter.patch("/:bookingId/cancel", bookingController.cancelBooking);

export default bookingsRouter;
