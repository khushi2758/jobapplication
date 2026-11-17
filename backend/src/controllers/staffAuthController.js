import jwt from "jsonwebtoken";
import Staff from "../models/Staff.js";

export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured");
    }

    // Find staff account and explicitly include its hidden password
    const staff = await Staff.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!staff) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password using the model's bcrypt method
    const isPasswordValid = await staff.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Only staff accounts can use this login
    if (staff.role !== "staff") {
      return res.status(403).json({
        success: false,
        message: "Staff access denied",
      });
    }

    // Generate JWT
    const accessToken = jwt.sign(
      {
        id: staff._id.toString(),
        role: staff.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      success: true,
      message: "Staff login successful",
      accessToken,
      staff: {
        id: staff._id,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (error) {
    console.error("Staff login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};