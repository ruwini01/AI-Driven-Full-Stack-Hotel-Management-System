import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import connectDB from "./src/infrastructure/db";
import globalErrorHandlingMiddleware from "./src/api/middleware/global-error-handling-middleware";
import { clerkMiddleware } from "@clerk/express";

// Connect DB once — Vercel serverless safe
connectDB();

const app = express();

/* ------------------------------
   CORS CONFIG
--------------------------------*/
const frontendOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5174",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

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
---------------------------------------*/

// Export for ES modules
const handler = serverless(app);
export default handler;

// Export for CommonJS (Vercel requires this)
module.exports = handler;
