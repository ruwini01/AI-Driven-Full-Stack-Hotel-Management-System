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
   CORS CONFIG - ALLOW ALL ORIGINS
   ⚠️ WARNING: Use with caution in production
--------------------------------*/
app.use(
  cors({
    origin: true, // Allow all origins
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

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