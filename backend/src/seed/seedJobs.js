
import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import Job from "../models/Job.js";

const jobs = [
    {
        title: "QA Engineer",
        track: "Quality Assurance",
        requiredSkills: [
            "Manual Testing",
            "Automation Testing",
            "Selenium",
            "Java",
            "Postman",
            "API Testing"
        ],
        description: "Test applications, identify defects and ensure software quality.",
        isOpen: true
    },
    {
        title: "Python Developer",
        track: "Backend Development",
        requiredSkills: [
            "Python",
            "Django",
            "Flask",
            "REST API",
            "SQL",
            "Git"
        ],
        description: "Build scalable backend applications and REST APIs using Python.",
        isOpen: true
    },
    {
        title: "Data Analyst",
        track: "Data Analytics",
        requiredSkills: [
            "Python",
            "SQL",
            "Excel",
            "Power BI",
            "Pandas",
            "Data Visualization"
        ],
        description: "Analyze datasets and generate meaningful business insights.",
        isOpen: true
    },
    {
        title: "AI Engineer",
        track: "Artificial Intelligence",
        requiredSkills: [
            "Python",
            "Machine Learning",
            "Deep Learning",
            "TensorFlow",
            "NLP",
            "Data Structures"
        ],
        description: "Develop and integrate intelligent AI-powered applications.",
        isOpen: true
    },
    {
        title: "Full Stack Developer",
        track: "Full Stack Development",
        requiredSkills: [
            "HTML",
            "CSS",
            "JavaScript",
            "React",
            "Node.js",
            "Express",
            "MongoDB"
        ],
        description: "Develop and maintain complete frontend and backend applications.",
        isOpen: true
    }
];

const seedJobs = async () => {
    try {
        await connectDB();

        for (const job of jobs) {
            await Job.updateOne(
                {
                    title: job.title,
                    track: job.track
                },
                {
                    $set: job
                },
                {
                    upsert: true,
                    runValidators: true,
                    setDefaultsOnInsert: true
                }
            );
        }

        console.log("Jobs seeded successfully!");
        console.log(`Total job postings processed: ${jobs.length}`);

    } catch (error) {
        console.error("Error seeding jobs:", error.message);
        process.exitCode = 1;

    } finally {
        await mongoose.disconnect();
        console.log("MongoDB connection closed.");
    }
};

seedJobs();
