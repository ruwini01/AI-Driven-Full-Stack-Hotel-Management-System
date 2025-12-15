import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import serverless from "serverless-http";
import connectDB from "./infrastructure/db";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";
import { clerkMiddleware } from "@clerk/express";
import bodyParser from "body-parser";
import { handleWebhook } from "./application/payment";

// Connect DB once — Vercel serverless safe
connectDB();

const app = express();


// Stripe webhook must use raw body before json parser
app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleWebhook
);

/* ------------------------------
   CORS CONFIG (ALLOW ALL ORIGINS)
--------------------------------*/
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
  })
);

app.use(express.json());
app.use(clerkMiddleware());

/* ------------------------------
   ROUTES
--------------------------------*/
import hotelRoute from "./api/hotel";
import reviewRoute from "./api/review";
import locationRoute from "./api/location";
import bookingsRouter from "./api/booking";
import paymentsRouter from "./api/payment";

app.use("/api/hotels", hotelRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/locations", locationRoute);
app.use("/api/bookings", bookingsRouter);
app.use("/api/payments", paymentsRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server running" });
});



// Global error middleware
app.use(globalErrorHandlingMiddleware);

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
export default serverless(app);
export { app };