
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  ArrowUpRight,
  RefreshCw,
  FileText,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

import {
  verifyStaff,
  staffLogout,
  type Staff,
} from "@/services/authService";

import {
  getApplications,
  type AdminApplication,
} from "@/services/adminService";

import { getAllJobs, type Job } from "@/services/jobService";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [staff, setStaff] = useState<Staff | null>(null);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState("");

  // Verify staff authentication
  useEffect(() => {
    let active = true;

    const checkAuthentication = async () => {
      try {
        const currentStaff = await verifyStaff();

        if (active) {
          setStaff(currentStaff);
        }
      } catch (error) {
        console.error("Authentication failed:", error);

        staffLogout();
        router.replace("/admin/login");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    checkAuthentication();

    return () => {
      active = false;
    };
  }, [router]);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      setDataLoading(true);
      setError("");

      const [applicationData, jobData] = await Promise.all([
        getApplications(),
        getAllJobs(),
      ]);

      setApplications(applicationData);
      setJobs(jobData);
    } catch (err: unknown) {
      console.error("Dashboard data error:", err);

      const status = (
        err as { response?: { status?: number } }
      )?.response?.status;

      if (status === 401 || status === 403) {
        staffLogout();
        router.replace("/admin/login");
        return;
      }

      setError(
        "Unable to load recruitment data. Check your backend connection and try again."
      );
    } finally {
      setDataLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (staff) {
      fetchDashboardData();
    }
  }, [staff, fetchDashboardData]);

  // Dashboard calculations
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

  const stats = [
    {
      title: "Total Applications",
      value: applications.length,
      description: "Total candidate submissions",
      icon: Users,
    },
    {
      title: "Active Job Postings",
      value: activeJobs,
      description: "Currently open positions",
      icon: BriefcaseBusiness,
    },
    {
      title: "Average Match Score",
      value: `${averageMatch}%`,
      description: "Average candidate skill match",
      icon: ChartNoAxesCombined,
    },
  ];

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f3f1]">
        <p className="text-sm text-gray-500">
          Verifying staff authentication...
        </p>
      </main>
    );
  }

  if (!staff) return null;

  return (
    <main className="min-h-screen bg-[#f3f3f1] lg:flex">

      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main dashboard */}
      <div className="min-w-0 flex-1">

        {/* Header */}
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          staffEmail={staff.email}
        />

        <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">

          {/* Welcome section */}
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#ff735f]">
                Staff Workspace
              </p>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#252525] sm:text-4xl">
                Welcome back!
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Here's an overview of your recruitment activities.
              </p>
            </div>

            <button
              onClick={fetchDashboardData}
              disabled={dataLoading}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw
                size={15}
                className={dataLoading ? "animate-spin" : ""}
              />
              Refresh Data
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              <p>{error}</p>

              <button
                onClick={fetchDashboardData}
                className="font-semibold underline"
              >
                Try again
              </button>
            </div>
          )}

          {/* Statistics */}
          <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="surface-card p-6 transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {stat.title}
                    </p>

                    <div className="rounded-xl bg-[#ffe3dc] p-3 text-[#ff735f]">
                      <Icon size={20} />
                    </div>
                  </div>

                  <h2 className="mt-6 text-4xl font-semibold tracking-tight text-[#252525]">
                    {dataLoading ? "..." : stat.value}
                  </h2>

                  <p className="mt-3 text-xs text-gray-400">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quick actions */}
          <div className="mt-8 grid gap-5 md:grid-cols-2">

            <Link
              href="/admin/dashboard/applications"
              className="surface-card group flex items-center justify-between p-6 transition hover:border-[#ff735f]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Users size={19} className="text-[#ff735f]" />
                  <h3 className="font-semibold">
                    Application Management
                  </h3>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Review candidates and analyze their skill matches.
                </p>
              </div>

              <ArrowUpRight
                size={20}
                className="shrink-0 text-gray-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#ff735f]"
              />
            </Link>

            <Link
              href="/admin/dashboard/jobs"
              className="surface-card group flex items-center justify-between p-6 transition hover:border-[#ff735f]"
            >
              <div>
                <div className="flex items-center gap-2">
                  <BriefcaseBusiness
                    size={19}
                    className="text-[#ff735f]"
                  />
                  <h3 className="font-semibold">
                    Manage Job Postings
                  </h3>
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Create, edit, and manage open vacancies.
                </p>
              </div>

              <ArrowUpRight
                size={20}
                className="shrink-0 text-gray-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#ff735f]"
              />
            </Link>
          </div>

          {/* Recent applications */}
          <div className="surface-card mt-8 overflow-hidden">

            <div className="flex flex-col justify-between gap-3 border-b border-gray-100 p-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-semibold text-[#252525]">
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

            {dataLoading ? (
              <div className="p-12 text-center text-sm text-gray-400">
                Loading applications...
              </div>
            ) : recentApplications.length === 0 ? (
              <div className="flex flex-col items-center p-12 text-center">
                <FileText
                  size={30}
                  className="text-gray-300"
                />

                <p className="mt-4 font-medium text-gray-600">
                  No applications yet
                </p>

                <p className="mt-2 text-sm text-gray-400">
                  Candidate submissions will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">

                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-500">
                      <th className="px-6 py-5 font-medium">
                        Candidate
                      </th>

                      <th className="px-6 py-5 font-medium">
                        Job Role
                      </th>

                      <th className="px-6 py-5 font-medium">
                        Match Score
                      </th>

                      <th className="px-6 py-5 font-medium">
                        Applied On
                      </th>
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
          </div>

          {/* Job overview */}
          <div className="surface-card mt-8 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">
                  Job Posting Overview
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  Current vacancies in your workspace
                </p>
              </div>

              <Link
                href="/admin/dashboard/jobs"
                className="text-sm font-medium text-[#ff735f] hover:underline"
              >
                Manage jobs →
              </Link>
            </div>

            {jobs.length === 0 ? (
              <p className="mt-6 text-sm text-gray-400">
                No job postings found.
              </p>
            ) : (
              <div className="mt-5 divide-y divide-gray-100">
                {jobs.slice(0, 4).map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#252525]">
                        {job.title}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {job.track}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        job.isOpen
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {job.isOpen ? "Open" : "Closed"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <footer className="py-8 text-center text-xs text-gray-400">
            © 2026 ArchintX. Staff Workspace.
          </footer>
        </section>
      </div>
    </main>
  );
}
