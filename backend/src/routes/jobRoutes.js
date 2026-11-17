
import express from "express";

import {
    getAllJobs,
    getJobById,
    createJob,
    updateJob
} from "../controllers/jobController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// STAFF ONLY ROUTES
router.post("/", protect, createJob);
router.put("/:id", protect, updateJob);

export default router;
