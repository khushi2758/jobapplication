
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { verifyStaff } from "@/services/authService";
import { getAllJobs } from "@/services/jobService";
import {
  getApplications,
  type AdminApplication,
} from "@/services/adminService";
import type { Job } from "@/services/jobService";

export default function AdminDashboard() {
  const router = useRouter();

  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [staffEmail, setStaffEmail] = useState("Staff Admin");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const staff = await verifyStaff();

        if (!active) return;

        setStaffEmail(staff.email);

        const [applicationData, jobData] = await Promise.all([
          getApplications(),
          getAllJobs(),
        ]);

        if (!active) return;

        setApplications(applicationData);
        setJobs(jobData);
      } catch (err: unknown) {
        console.error("Dashboard loading error:", err);

        if (!active) return;

        const errorStatus = (
          err as { response?: { status?: number } }
        )?.response?.status;

        if (errorStatus === 401 || errorStatus === 403) {
          router.replace("/admin/login");
          return;
        }

        setError(
          "Unable to load dashboard data. Please refresh and try again."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDashboard();

    return () => {
      active = false;
    };
  }, [router]);

  const activeJobs = jobs.filter((job) => job.isOpen).length;

  const averageMatch =
    applications.length > 0
      ? Math.round(
          applications.reduce(
            (total, application) =>
              total + (application.matchScore || 0),
            0
          ) / applications.length
        )
      : 0;

  const recentApplications = [...applications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f1] p-5 md:p-8 lg:p-10">

      {/* Welcome */}
      <div className="mb-10">
        <p className="mb-3 text-sm font-medium uppercase tracking-widest text-[#ff735f]">
          Staff Workspace
        </p>

        <h1 className="text-3xl font-semibold tracking-tight text-[#252525]">
          Welcome back!
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Here's an overview of your recruitment activities.
        </p>

        <p className="mt-2 text-xs text-gray-400">
          Logged in as {staffEmail}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-3 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Statistics */}
      <div className="mb-10 grid grid-cols-1 gap-5 md:grid-cols-3">

        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Applications
          </p>

          <h2 className="mt-6 text-4xl font-semibold text-[#252525]">
            {applications.length}
          </h2>

          <p className="mt-3 text-xs text-gray-400">
            Total candidates applied
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <p className="text-sm text-gray-500">
            Active Job Postings
          </p>

          <h2 className="mt-6 text-4xl font-semibold text-[#252525]">
            {activeJobs}
          </h2>

          <p className="mt-3 text-xs text-gray-400">
            Currently open positions
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
          <p className="text-sm text-gray-500">
            Average Match Score
          </p>

          <h2 className="mt-6 text-4xl font-semibold text-[#252525]">
            {averageMatch}%
          </h2>

          <p className="mt-3 text-xs text-gray-400">
            Average candidate skill match
          </p>
        </div>
      </div>

      {/* Recent Applications */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold text-[#252525]">
              Recent Applications
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Latest candidate submissions
            </p>
          </div>

          <Link
            href="/admin/dashboard/applications"
            className="text-sm font-medium text-[#ff735f] hover:underline"
          >
            View all applications →
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-medium text-gray-600">
              No applications received yet.
            </p>

            <p className="mt-2 text-sm text-gray-400">
              Applications will appear here when candidates apply.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-500">
                  <th className="px-6 py-5 font-medium">Candidate</th>
                  <th className="px-6 py-5 font-medium">Job Role</th>
                  <th className="px-6 py-5 font-medium">Match Score</th>
                  <th className="px-6 py-5 font-medium">Applied On</th>
                </tr>
              </thead>

              <tbody>
                {recentApplications.map((application) => (
                  <tr
                    key={application._id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >
                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-[#252525]">
                        {application.name}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {application.email}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      {application.jobId?.title || "Unknown Job"}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-[#ffe3dc] px-3 py-2 text-xs font-medium text-[#ff735f]">
                        {application.matchScore ?? 0}%
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-500">
                      {formatDate(application.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
