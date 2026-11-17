
import express from "express";
import cors from "cors";

import staffAuthRoutes from "./routes/staffAuthRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://jobapplication-tau.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "ArchintX Backend Server is running",
  });
});

// API routes
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin/auth", staffAuthRoutes);
app.use("/api/admin", adminRoutes);

export default app;
