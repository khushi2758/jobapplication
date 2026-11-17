
"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/common/Navbar";
import JobCard from "@/components/jobs/JobCard";
import { getAllJobs, type Job } from "@/services/jobService";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        setJobs(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load available jobs.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const tracks = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((job) => job.track)))],
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = search.toLowerCase();

      const matchesSearch =
        job.title.toLowerCase().includes(query) ||
        job.track.toLowerCase().includes(query) ||
        job.requiredSkills.some((skill) =>
          skill.toLowerCase().includes(query)
        );

      const matchesTrack =
        selectedTrack === "All" || job.track === selectedTrack;

      return matchesSearch && matchesTrack;
    });
  }, [jobs, search, selectedTrack]);

  return (
    <main className="dashboard-container">
      <Navbar />

      <section className="py-12">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
          Career opportunities
        </p>

        <h1 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">
          Explore <span className="font-semibold">vacancies.</span>
        </h1>

        <p className="mt-3 max-w-lg text-sm leading-6 text-gray-500">
          Find opportunities that align with your skills,
          interests and career goals.
        </p>

        <div className="surface-card mt-8 flex items-center gap-3 px-4 py-3">
          <span className="text-gray-400">⌕</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search job titles, tracks or skills..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tracks.map((track) => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`rounded-full border px-4 py-2 text-xs transition ${
                selectedTrack === track
                  ? "border-[#292929] bg-[#292929] text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {track}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-medium">Available positions</h2>
          <span className="text-xs text-gray-400">
            {filteredJobs.length} opportunities
          </span>
        </div>

        {loading && (
          <p className="py-12 text-center text-sm text-gray-400">
            Loading vacancies...
          </p>
        )}

        {error && (
          <p className="py-12 text-center text-sm text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="surface-card py-12 text-center">
            <p className="text-sm text-gray-500">
              No matching opportunities found.
            </p>
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
