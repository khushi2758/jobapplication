import express from "express";
import { staffLogin } from "../controllers/staffAuthController.js";
import { protectStaff } from "../middleware/staffAuthMiddleware.js";

const router = express.Router();

router.post("/login", staffLogin);

router.get("/me", protectStaff, (req, res) => {
  return res.status(200).json({
    success: true,
    staff: {
      id: req.staff._id,
      email: req.staff.email,
      role: req.staff.role,
    },
  });
});

export default router;