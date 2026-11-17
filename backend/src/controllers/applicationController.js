
import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";

export const submitApplication = async (req, res) => {
  try {
    const { name, email, resumeText, jobId } = req.body;

    // 1. Validate required fields
    if (!name?.trim() || !email?.trim() || !resumeText?.trim() || !jobId) {
      return res.status(400).json({
        success: false,
        message: "Name, email, resume text and job ID are required",
      });
    }

    // 2. Validate MongoDB job ID
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 3. Find selected job
    const job = await Job.findOne({
      _id: jobId,
      isOpen: true,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or no longer available",
      });
    }

    // 4. Check for an existing application
    const existingApplication = await Application.findOne({
      email: normalizedEmail,
      jobId: job._id,
    });

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    // 5. Normalize resume text
    const normalizedResume = resumeText.toLowerCase();

    // 6. Compare required skills with resume
    const matchedSkills = job.requiredSkills.filter((skill) =>
      normalizedResume.includes(skill.toLowerCase())
    );

    const missingSkills = job.requiredSkills.filter(
      (skill) => !matchedSkills.includes(skill)
    );

    // 7. Calculate match percentage
    const matchScore =
      job.requiredSkills.length > 0
        ? Math.round(
            (matchedSkills.length / job.requiredSkills.length) * 100
          )
        : 0;

    // 8. Save application
    const application = await Application.create({
      name: name.trim(),
      email: normalizedEmail,
      resumeText: resumeText.trim(),
      jobId: job._id,
      matchedSkills,
      missingSkills,
      matchScore,
    });

    // 9. Return successful result
    return res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      application: {
        id: application._id,
        name: application.name,
        email: application.email,
        job: {
          id: job._id,
          title: job.title,
        },
        matchedSkills,
        missingSkills,
        matchScore,
      },
    });

  } catch (error) {
    console.error("Submit application error:", error);

    // Handle duplicate-key error from MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};
