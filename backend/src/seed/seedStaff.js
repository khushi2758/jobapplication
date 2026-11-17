
import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Staff from "../models/Staff.js";

const seedStaff = async () => {
    try {
        await connectDB();

        const email = process.env.SEED_STAFF_EMAIL?.trim().toLowerCase();
        const password = process.env.SEED_STAFF_PASSWORD;

        if (!email || !password) {
            throw new Error(
                "SEED_STAFF_EMAIL and SEED_STAFF_PASSWORD are required in .env"
            );
        }

        if (password.length < 12) {
            throw new Error(
                "Staff seed password must contain at least 12 characters"
            );
        }

        const existingStaff = await Staff.findOne({ email });

        if (existingStaff) {
            existingStaff.password = password;
            existingStaff.role = "staff";

            await existingStaff.save();

            console.log("Existing staff password updated successfully!");
        } else {
            await Staff.create({
                email,
                password,
                role: "staff"
            });

            console.log("Staff account created successfully!");
        }

    } catch (error) {
        console.error("Error seeding staff:", error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
        console.log("MongoDB connection closed.");
    }
};

seedStaff();
