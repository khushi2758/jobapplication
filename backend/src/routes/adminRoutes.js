import express from "express";
import { getApplications } from "../controllers/adminApplicationController.js";
import { protectStaff } from "../middleware/staffAuthMiddleware.js";

const router = express.Router();

router.get("/applications", protectStaff, getApplications);

export default router;