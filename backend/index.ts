// index.ts
import express from "express";
import cors from "cors";
import serverless from "serverless-http";
import connectDB from "./src/infrastructure/db";
import globalErrorHandlingMiddleware from "./src/api/middleware/global-error-handling-middleware";
import { clerkMiddleware } from "@clerk/express";

/* ------------------------------
   CREATE APP
--------------------------------*/
const app = express();

/* ------------------------------
   HEALTH CHECK (early)
--------------------------------*/
// Always respond fast without Clerk/DB delays
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server running" });
});

/* ------------------------------
   CONNECT TO MONGODB
--------------------------------*/
(async () => {
  try {
    await connectDB(); // cached connection reduces serverless cold start delays
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
})();

/* ------------------------------
   CORS CONFIG
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
      return callback(null, false); // safe for serverless
    },
    credentials: true,
  })
);

app.use(express.json());

/* ------------------------------
   CLERK MIDDLEWARE
--------------------------------*/
app.use(clerkMiddleware()); // no wrapper needed

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

/* ------------------------------
   GLOBAL ERROR HANDLER
--------------------------------*/
app.use(globalErrorHandlingMiddleware);


/* ------------------------------
   LOCAL DEVELOPMENT
--------------------------------*/
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`🚀 Local server running at http://localhost:${PORT}`);
  });
}


/* ------------------------------
   EXPORT FOR VERCEL SERVERLESS
--------------------------------*/
const handler = serverless(app);
export default handler;
module.exports = handler;
