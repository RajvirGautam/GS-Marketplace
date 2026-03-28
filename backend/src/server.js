import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import passport from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import dealRoutes from './routes/dealRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import './config/cloudinary.js';

dotenv.config();

// ─── Crash diagnostics ────────────────────────────────────────────────────────
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION:', err.message, err.stack);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('💥 UNHANDLED REJECTION:', reason);
  process.exit(1);
});
// ──────────────────────────────────────────────────────────────────────────────

const app = express();
const httpServer = createServer(app);

// ─── Allowed Origins ──────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ...(process.env.FRONTEND_URL_ALT ? [process.env.FRONTEND_URL_ALT] : []),
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
};

// ─── Socket.IO Setup ───────────────────────────────────────────────────────────
export const io = new Server(httpServer, {
  cors: corsOptions,
});

// Socket auth middleware — validate JWT from handshake
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error('Authentication required'));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId || decoded.id || decoded._id;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

io.on('connection', (socket) => {
  // Each user joins their own private room for targeted notifications
  socket.join(`user:${socket.userId}`);
  console.log(`🔌 Socket connected: user ${socket.userId}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Socket disconnected: user ${socket.userId}`);
  });
});

// ──────────────────────────────────────────────────────────────────────────────

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  console.log('Good Morning 🌅');
  res.json({ status: 'ok', message: 'Server is running' });
});

// ─── Keep-Alive Ping (prevents Render free-tier cold starts) ──────────────────
// Render spins down after 15 min of inactivity; ping every 10 min to prevent it.
const PING_INTERVAL_MS = 13 * 60 * 1000; // 10 minutes

function startKeepAlivePing() {
  const baseUrl = process.env.RENDER_EXTERNAL_URL;
  if (!baseUrl) {
    console.log('ℹ️  RENDER_EXTERNAL_URL not set — keep-alive ping disabled (local dev)');
    return;
  }

  const pingUrl = `${baseUrl}/api/health`;
  console.log(`🏓 Keep-alive ping enabled → ${pingUrl} every 10 min`);

  setInterval(async () => {
    try {
      const res = await fetch(pingUrl);
      console.log(`🏓 Keep-alive ping → ${res.status} ${res.statusText}`);
    } catch (err) {
      console.warn(`⚠️  Keep-alive ping failed: ${err.message}`);
    }
  }, PING_INTERVAL_MS);
}
// ──────────────────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({ message: 'SGSITS Marketplace API is running 🚀' });
});

// Start Server
const PORT = process.env.PORT || 5001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  startKeepAlivePing();
});

export default app;
