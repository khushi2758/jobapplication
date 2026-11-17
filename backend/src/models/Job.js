
import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true
        },

        track: {
            type: String,
            required: [true, "Job track is required"],
            trim: true
        },

        requiredSkills: {
            type: [String],
            required: [true, "Required skills are necessary"],
            validate: {
                validator: function (skills) {
                    return skills.length > 0;
                },
                message: "At least one skill is required"
            }
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        isOpen: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
