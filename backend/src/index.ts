import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import serverless from "serverless-http";
import connectDB from "./infrastructure/db";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";
import { clerkMiddleware } from "@clerk/express";

// Connect DB once — Vercel serverless safe
connectDB();

const app = express();

/* ------------------------------
   CORS CONFIG (FINAL VERSION)
--------------------------------*/
const frontendOrigins = [
  process.env.FRONTEND_URL,            // Your frontend Vercel domain
  "http://localhost:5174",             // Local frontend
  "http://localhost:3000",             // Alternative local frontend
].filter(Boolean); // removes null/undefined

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // Mobile apps, postman, same-domain

      if (frontendOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("⛔ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
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

app.use("/api/hotels", hotelRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/locations", locationRoute);
app.use("/api/bookings", bookingsRouter);

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
