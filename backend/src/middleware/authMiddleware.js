
import jwt from "jsonwebtoken";
import Staff from "../models/Staff.js";

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const staff = await Staff.findById(decoded.id);

        if (!staff) {
            return res.status(401).json({
                success: false,
                message: "Staff account not found"
            });
        }

        req.staff = staff;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};
