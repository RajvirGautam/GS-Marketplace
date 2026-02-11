import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/database.js";
import { requireAuth } from "./middleware/ClerkAuth.js";


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  credentials: true 
}));
/* app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
})); */
app.use(compression());
app.use(morgan("dev"));

// Health check route
app.get("/api/health", (req, res) => {
  res.json({ 
    success: true, 
    message: "SGSITS Marketplace API is healthy",
    timestamp: new Date().toISOString()
  });
});

app.get("/api/protected", requireAuth, (req, res) => {
  res.json({
    success: true,
    message: "You are authenticated!",
    clerkUserId: req.clerkUserId,
    email: req.userEmail,
  });
});


app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

const PORT = process.env.PORT || 5001;

// Temporary: Start server without DB
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
  console.log(`⚠️  MongoDB not connected yet`);
});
