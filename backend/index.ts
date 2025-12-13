import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import connectDB from "./src/infrastructure/db";
import globalErrorHandlingMiddleware from "./src/api/middleware/global-error-handling-middleware";
import { clerkMiddleware } from "@clerk/express";

// Create app
const app = express();

/* ------------------------------------
   CONNECT TO DB (Vercel optimized)
--------------------------------------*/
(async () => {
  // Only connects once because of cached logic in db.ts
  await connectDB();
})();

/* ------------------------------
   CORS CONFIG (safe version)
--------------------------------*/
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("⛔ Blocked by CORS:", origin);
      return callback(null, false); // safer than throwing in serverless
    },
    credentials: true,
  })
);

app.use(express.json());

/* ------------------------------------
   CLERK MIDDLEWARE
--------------------------------------*/
app.use((req, res, next) => {
  try {
    return clerkMiddleware()(req, res, next);
  } catch (err) {
    console.error("Clerk error:", err);
    next();
  }
});

/* ------------------------------
   ROUTES — moved below DB
--------------------------------*/
import hotelRoute from "./src/api/hotel";
import reviewRoute from "./src/api/review";
import locationRoute from "./src/api/location";
import bookingsRouter from "./src/api/booking";

app.use("/api/hotels", hotelRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/locations", locationRoute);
app.use("/api/bookings", bookingsRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server running" });
});

// Global error handler
app.use(globalErrorHandlingMiddleware);

/* ------------------------------------
   EXPORT HANDLER FOR VERCEL
--------------------------------------*/
const handler = serverless(app);
export default handler;
module.exports = handler;
