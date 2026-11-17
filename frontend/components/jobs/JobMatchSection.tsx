
"use client";

import { useEffect, useState } from "react";
import { getAllJobs, type Job } from "@/services/jobService";
import MatchCard from "./MatchCard";

export default function JobMatchSection() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Unable to load job opportunities.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] muted-text">
            Explore opportunities
          </p>
          <h2 className="mt-2 text-2xl font-medium tracking-tight">
            Job opportunities
          </h2>
        </div>

        <a
          href="/jobs"
          className="text-xs text-gray-500 hover:text-black"
        >
          View all ↗
        </a>
      </div>

      {loading && (
        <p className="py-10 text-center text-sm muted-text">
          Loading opportunities...
        </p>
      )}

      {error && (
        <p className="py-10 text-center text-sm text-red-500">
          {error}
        </p>
      )}

      {!loading && !error && jobs.length === 0 && (
        <p className="py-10 text-center text-sm muted-text">
          No job opportunities available right now.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {jobs.slice(0, 4).map((job) => (
          <MatchCard
            key={job._id}
            jobId={job._id}
            title={job.title}
            company={job.track}
            skills={job.requiredSkills}
          />
        ))}
      </div>
    </section>
  );
}
