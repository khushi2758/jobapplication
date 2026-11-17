
import Job from "../models/Job.js";
import mongoose from "mongoose";
// GET ALL OPEN JOBS
export const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ isOpen: true })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: jobs.length,
            message: "Jobs fetched successfully",
            jobs
        });

    } catch (error) {
        console.error("Get Jobs Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch jobs"
        });
    }
};
export const createJob = async (req, res) => {
    try {
        const {
            title,
            track,
            requiredSkills,
            description
        } = req.body;

        // Validate required fields
        if (
            !title?.trim() ||
            !track?.trim() ||
            !Array.isArray(requiredSkills) ||
            requiredSkills.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Title, track and required skills are mandatory"
            });
        }

        // Validate skill values
        const validSkills = requiredSkills
            .filter(skill => typeof skill === "string")
            .map(skill => skill.trim())
            .filter(Boolean);

        if (validSkills.length !== requiredSkills.length) {
            return res.status(400).json({
                success: false,
                message: "All skills must be non-empty strings"
            });
        }

        // Create job
        const job = await Job.create({
            title: title.trim(),
            track: track.trim(),
            requiredSkills: validSkills,
            description: description?.trim() || "",
            isOpen: true
        });

        return res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });

    } catch (error) {
        console.error("Create Job Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to create job"
        });
    }
};



// UPDATE JOB - STAFF ONLY
export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            track,
            requiredSkills,
            description,
            isOpen
        } = req.body;

        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID"
            });
        }

        // Prevent empty update requests
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required"
            });
        }

        // Only allow specified fields
        const allowedFields = [
            "title",
            "track",
            "requiredSkills",
            "description",
            "isOpen"
        ];

        const invalidFields = Object.keys(req.body)
            .filter(field => !allowedFields.includes(field));

        if (invalidFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Invalid fields: ${invalidFields.join(", ")}`
            });
        }

        // Validate provided fields
        if (title !== undefined &&
            (typeof title !== "string" || !title.trim())) {
            return res.status(400).json({
                success: false,
                message: "Invalid job title"
            });
        }

        if (track !== undefined &&
            (typeof track !== "string" || !track.trim())) {
            return res.status(400).json({
                success: false,
                message: "Invalid job track"
            });
        }

        if (requiredSkills !== undefined) {
            if (
                !Array.isArray(requiredSkills) ||
                requiredSkills.length === 0 ||
                requiredSkills.some(
                    skill => typeof skill !== "string" || !skill.trim()
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Provide at least one valid skill"
                });
            }
        }

        if (description !== undefined &&
            typeof description !== "string") {
            return res.status(400).json({
                success: false,
                message: "Description must be a string"
            });
        }

        if (isOpen !== undefined && typeof isOpen !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isOpen must be a boolean"
            });
        }

        const updateData = {};

        if (title !== undefined) updateData.title = title.trim();
        if (track !== undefined) updateData.track = track.trim();

        if (requiredSkills !== undefined) {
            updateData.requiredSkills = requiredSkills.map(
                skill => skill.trim()
            );
        }

        if (description !== undefined) {
            updateData.description = description.trim();
        }

        if (isOpen !== undefined) {
            updateData.isOpen = isOpen;
        }

        const job = await Job.findByIdAndUpdate(
            id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job
        });

    } catch (error) {
        console.error("Update Job Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to update job"
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid job ID"
            });
        }

        const job = await Job.findOne({
            _id: id,
            isOpen: true
        });

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found or no longer available"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job fetched successfully",
            job
        });

    } catch (error) {
        console.error("Get Job Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch job"
        });
    }
};
