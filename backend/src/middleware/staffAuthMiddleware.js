import jwt from "jsonwebtoken";
import Staff from "../models/Staff.js";

export const protectStaff = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Confirm this token represents a staff account
    if (!decoded.id || decoded.role !== "staff") {
      return res.status(403).json({
        success: false,
        message: "Staff access denied",
      });
    }

    // Confirm the staff account still exists
    const staff = await Staff.findById(decoded.id);

    if (!staff || staff.role !== "staff") {
      return res.status(401).json({
        success: false,
        message: "Staff account not found or access revoked",
      });
    }

    req.staff = staff;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Access token expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid access token",
    });
  }
};