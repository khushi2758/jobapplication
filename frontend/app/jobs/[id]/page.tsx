
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/common/Navbar";
import { getJobById, type Job } from "@/services/jobService";

interface JobDetailsPageProps {
    params: Promise<{ id: string }>;
}

export default function JobDetailsPage({ params }: JobDetailsPageProps) {
    const router = useRouter();

    const [jobId, setJobId] = useState("");
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadJob = async () => {
            try {
                const { id } = await params;

                if (!active) return;

                setJobId(id);

                const data = await getJobById(id);

                if (active) setJob(data);
            } catch (err) {
                console.error("Job fetching error:", err);

                if (active) {
                    setError("Unable to find this job opportunity.");
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadJob();

        return () => {
            active = false;
        };
    }, [params]);

    if (loading) {
        return (
            <main className="dashboard-container">
                <Navbar />
                <p className="py-20 text-center text-sm text-gray-400">
                    Loading job details...
                </p>
            </main>
        );
    }

    if (error || !job) {
        return (
            <main className="dashboard-container">
                <Navbar />
                <div className="surface-card mt-16 p-10 text-center">
                    <h2 className="text-xl font-semibold">Job not found</h2>
                    <p className="mt-3 text-sm text-gray-500">{error}</p>
                    <Link href="/jobs" className="mt-6 inline-block">
                        Back to vacancies
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="dashboard-container">
            <Navbar />

            <button
                onClick={() => router.back()}
                className="mt-8 text-xs text-gray-500"
            >
                ← Back to vacancies
            </button>

            <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
                <div className="surface-card p-6 sm:p-10">
                    <p className="text-xs uppercase tracking-widest text-gray-400">
                        {job.track}
                    </p>

                    <h1 className="mt-4 text-3xl font-semibold sm:text-5xl">
                        {job.title}
                    </h1>

                    <span className="mt-5 inline-block rounded-full bg-gray-100 px-4 py-2 text-xs">
                        {job.isOpen ? "Currently Open" : "Closed"}
                    </span>

                    <div className="mt-10 border-t border-gray-100 pt-8">
                        <h2 className="text-lg font-semibold">
                            About this opportunity
                        </h2>

                        <p className="mt-4 whitespace-pre-line text-sm leading-8 text-gray-500">
                            {job.description || "No description available."}
                        </p>
                    </div>

                    <div className="mt-10 border-t border-gray-100 pt-8">
                        <h2 className="text-lg font-semibold">
                            Required skills
                        </h2>

                        <div className="mt-5 flex flex-wrap gap-3">
                            {job.requiredSkills.map((skill) => (
                                <span
                                    key={skill}
                                    className="rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <aside className="surface-card h-fit p-6">
                    <h2 className="text-xl font-semibold">
                        Ready to apply?
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        Submit your resume to discover your skill match.
                    </p>

                    {job.isOpen && (
                        <Link
                            href={`/apply/${jobId}`}
                            className="mt-8 block rounded-full bg-[#bff0aa] px-5 py-3.5 text-center text-xs text-white border-2 border-[#460808] hover:bg-[#c9ddb4] transition"
                        >
                            Apply for this position ↗
                        </Link>
                    )}
                </aside>
            </section>
        </main>
    );
}
