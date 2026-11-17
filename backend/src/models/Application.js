
import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Candidate name is required"],
            trim: true
        },

       email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address"
    ]
},

        resumeText: {
            type: String,
            required: [true, "Resume text is required"],
            trim: true
        },

        jobId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: [true, "Job reference is required"]
        },

        matchedSkills: {
            type: [String],
            default: []
        },

        missingSkills: {
            type: [String],
            default: []
        },

        matchScore: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        
    },
    {
        timestamps: true
    }
);
applicationSchema.index(
  { email: 1, jobId: 1 },
  { unique: true }
);
const Application = mongoose.model(
    "Application",
    applicationSchema
);

export default Application;
