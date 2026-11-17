
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import { getJobById, type Job } from "@/services/jobService";
import {
  submitApplication,
  type ApplicationResult,
} from "@/services/applicationService";

interface ApplicationFormProps {
  jobId: string;
}

export default function ApplicationForm({ jobId }: ApplicationFormProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [resumeText, setResumeText] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ApplicationResult | null>(null);

  useEffect(() => {
    let active = true;

    const fetchJob = async () => {
      try {
        const data = await getJobById(jobId);
        if (active) setJob(data);
      } catch (err) {
        console.error("Job fetch error:", err);
        if (active) setError("Unable to load this job.");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchJob();

    return () => {
      active = false;
    };
  }, [jobId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting) return;

    setError("");

    if (resumeText.trim().length < 30) {
      setError("Please enter more resume details before submitting.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await submitApplication({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        resumeText: resumeText.trim(),
        jobId,
      });

      setResult(response.application);
    } catch (err: unknown) {
      console.error("Application submission error:", err);

      const errorMessage =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
          ? err.response.data.message
          : "Unable to submit your application. Please try again.";

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="dashboard-container">
        <Navbar />
        <p className="py-20 text-center text-sm text-gray-400">
          Loading application form...
        </p>
      </main>
    );
  }

  // Job unavailable
  if (!job) {
    return (
      <main className="dashboard-container">
        <Navbar />

        <div className="surface-card mt-12 p-8 text-center">
          <h2 className="text-xl font-semibold">Job unavailable</h2>

          <p className="mt-2 text-sm text-gray-500">{error}</p>

          <Link
            href="/jobs"
            className="mt-5 inline-block text-sm underline"
          >
            Browse vacancies
          </Link>
        </div>
      </main>
    );
  }

  // Successful application result
  if (result) {
    return (
      <main className="dashboard-container">
        <Navbar />

        <section className="mx-auto mt-10 max-w-3xl">
          <div className="surface-card p-6 sm:p-10">

            {/* Success confirmation */}
            <div
              role="status"
              aria-live="polite"
              className="mb-7 rounded-xl border border-green-200 bg-green-50 p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                  ✓
                </span>

                <div>
                  <h2 className="text-sm font-semibold text-green-800">
                    Application submitted successfully!
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-green-700">
                    Your application for {result.job.title} has been
                    received successfully.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs uppercase tracking-widest text-gray-400">
              Application result
            </p>

            <h1 className="mt-3 text-3xl font-semibold">
              Your skill analysis
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Here is how your resume matches the job requirements.
            </p>

            {/* Match score */}
            <div className="mt-8 flex flex-col items-center rounded-2xl bg-[#f1f1ef] p-8">
              <div className="match-circle">
                <span>{result.matchScore}%</span>
                <span>Skill Match</span>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Your resume match score
              </p>
            </div>

            {/* Matched and missing skills */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div>
                <h2 className="text-sm font-semibold">
                  Matched skills ({result.matchedSkills.length})
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {result.matchedSkills.length > 0 ? (
                    result.matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-green-50 px-3 py-2 text-xs text-green-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">
                      No matched skills.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold">
                  Missing skills ({result.missingSkills.length})
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {result.missingSkills.length > 0 ? (
                    result.missingSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-orange-50 px-3 py-2 text-xs text-orange-700"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">
                      No missing skills.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/jobs"
              className="mt-9 block rounded-full bg-[#292929] px-6 py-3 text-center text-xs text-white transition hover:bg-black"
            >
              Explore more opportunities
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Application form
  return (
    <main className="dashboard-container">
      <Navbar />

      <section className="mx-auto mt-10 max-w-3xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-gray-400">
            Candidate application
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Apply for {job.title}
          </h1>

          <p className="mt-2 text-sm text-gray-500">{job.track}</p>
        </div>

        <form onSubmit={handleSubmit} className="surface-card p-6 sm:p-9">
          <div className="space-y-6">
            {/* Full name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs font-medium"
              >
                Full name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Enter your full name"
                required
                maxLength={100}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                maxLength={254}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500"
              />
            </div>

            {/* Resume */}
            <div>
              <label
                htmlFor="resumeText"
                className="mb-2 block text-xs font-medium"
              >
                Resume text
              </label>

              <textarea
                id="resumeText"
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
                placeholder="Paste your resume content here, including skills, experience, projects and education..."
                required
                minLength={30}
                maxLength={20000}
                rows={10}
                className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-gray-500"
              />

              <p className="mt-2 text-right text-[10px] text-gray-400">
                {resumeText.length}/20,000 characters
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <p
              role="alert"
              aria-live="assertive"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-600"
            >
              {error}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="mt-7 w-full rounded-full bg-[#292929] px-6 py-3.5 text-xs font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting
              ? "Analyzing your resume..."
              : "Submit application ↗"}
          </button>

          <p className="mt-4 text-center text-[10px] text-gray-400">
            Your match score is calculated by the backend using the job's
            required skills.
          </p>
        </form>
      </section>
    </main>
  );
}
