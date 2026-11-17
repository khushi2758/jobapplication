
import express from "express";
import cors from "cors";
import staffAuthRoutes from "./routes/staffAuthRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
const app = express();

app.use(express.json());

app.use(cors({
    origin: "https://jobapplication-tau.vercel.app/",
    credentials: true
}));

// Routes
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "ArchintX Backend Server is running"
    });
});

app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin/auth", staffAuthRoutes);
app.use("/api/admin", adminRoutes);

export default app;
