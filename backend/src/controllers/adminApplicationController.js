import mongoose from "mongoose";
import Application from "../models/Application.js";

export const getApplications = async (req, res) => {
    try {
        const { job_id } = req.query;

        const filter = {};

        // Optional filtering by job ID
        if (job_id) {
            if (!mongoose.Types.ObjectId.isValid(job_id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid job ID"
                });
            }

            filter.jobId = job_id;
        }

        // Fetch applications and include related job details
        const applications = await Application.find(filter)
            .populate("jobId", "title track requiredSkills")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: applications.length,
            message: "Applications fetched successfully",
            applications
        });

    } catch (error) {
        console.error("Get applications error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch applications"
        });
    }
};