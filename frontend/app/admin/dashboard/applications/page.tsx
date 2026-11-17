
"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { verifyStaff, type Staff } from "@/services/authService";
import {
  getApplications,
  type AdminApplication,
} from "@/services/adminService";
import { getAllJobs, type Job } from "@/services/jobService";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Eye,
  RefreshCw,
  Users,
} from "lucide-react";

export default function ApplicationsPage() {
  const router = useRouter();

  const [staff, setStaff] = useState<Staff | null>(null);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Verify staff authentication
  useEffect(() => {
    let active = true;

    const checkStaff = async () => {
      try {
        const currentStaff = await verifyStaff();

        if (active) setStaff(currentStaff);
      } catch (err) {
        console.error("Staff verification failed:", err);
        router.replace("/admin/login");
      }
    };

    checkStaff();

    return () => {
      active = false;
    };
  }, [router]);

  // Fetch applications and jobs
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [applicationData, jobData] = await Promise.all([
        getApplications(),
        getAllJobs(),
      ]);

      setApplications(applicationData);
      setJobs(jobData);
    } catch (err) {
      console.error("Applications fetch error:", err);
      setError("Unable to load applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staff) {
      fetchData();
    }
  }, [staff]);

  // Search and filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesSearch =
        application.name.toLowerCase().includes(search.toLowerCase()) ||
        application.email.toLowerCase().includes(search.toLowerCase());

      const matchesJob =
        selectedJob === "all" ||
        application.jobId?._id === selectedJob;

      return matchesSearch && matchesJob;
    });
  }, [applications, search, selectedJob]);

  return (
    <main className="min-h-screen bg-[#f3f3f1] lg:flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          staffEmail={staff?.email}
        />

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

          {/* Page heading */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#ff735f]">
                Staff workspace
              </p>

              <h1 className="mt-3 text-3xl font-semibold">
                Applications
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Review and manage candidate applications.
              </p>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 rounded-full bg-[#292929] px-5 py-3 text-xs text-white hover:bg-black disabled:opacity-50"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          {/* Summary */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="surface-card flex items-center gap-4 p-5">
              <div className="rounded-xl bg-[#ffe3dc] p-3 text-[#e76552]">
                <Users size={22} />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Total Applications
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {applications.length}
                </p>
              </div>
            </div>

            <div className="surface-card flex items-center gap-4 p-5">
              <div className="rounded-xl bg-gray-100 p-3 text-gray-600">
                <Filter size={22} />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Filtered Results
                </p>

                <p className="mt-1 text-2xl font-semibold">
                  {filteredApplications.length}
                </p>
              </div>
            </div>
          </div>

          {/* Search and filter */}
          <div className="surface-card mt-8 flex flex-col gap-4 p-5 md:flex-row">

            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidate name or email..."
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#ff735f]"
              />
            </div>

            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#ff735f] md:w-64"
            >
              <option value="all">All job roles</option>

              {jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          {/* Error */}
          {error && (
            <div role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Applications table */}
          <div className="surface-card mt-6 overflow-hidden">

            <div className="border-b border-gray-100 p-6">
              <h2 className="font-semibold">
                Candidate Applications
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                {filteredApplications.length} candidates found
              </p>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm text-gray-400">
                Loading applications...
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-12 text-center">
                <Users size={32} className="mx-auto text-gray-300" />

                <p className="mt-4 text-sm font-medium">
                  No applications found
                </p>

                <p className="mt-2 text-xs text-gray-400">
                  Try changing your search or job filter.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">

                  <thead className="bg-[#fafaf9] text-xs text-gray-500">
                    <tr>
                      <th className="whitespace-nowrap px-6 py-4">Candidate</th>
                      <th className="whitespace-nowrap px-6 py-4">Job Role</th>
                      <th className="whitespace-nowrap px-6 py-4">Match Score</th>
                      <th className="whitespace-nowrap px-6 py-4">Applied Date</th>
                      <th className="whitespace-nowrap px-6 py-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredApplications.map((application) => (
                      <tr
                        key={application._id}
                        className="border-t border-gray-100 hover:bg-[#fafaf9]"
                      >
                        <td className="px-6 py-4">
                          <p className="whitespace-nowrap text-sm font-medium">
                            {application.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {application.email}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                          {application.jobId?.title || "Unavailable"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-[#ffe3dc] px-3 py-1.5 text-xs font-medium text-[#e76552]">
                            {application.matchScore}%
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-xs text-gray-500">
                          {new Date(application.createdAt).toLocaleDateString("en-IN")}
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              router.push(
                                `/admin/dashboard/applications/${application._id}`
                              )
                            }
                            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs hover:border-[#ff735f] hover:text-[#e76552]"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
