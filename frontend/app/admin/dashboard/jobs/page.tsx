
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  BriefcaseBusiness,
  Search,
  Pencil,
  X,
  RefreshCw,
} from "lucide-react";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

import {
  verifyStaff,
  staffLogout,
  type Staff,
} from "@/services/authService";

import { getAllJobs, type Job } from "@/services/jobService";

import {
  createJob,
  updateJob,
  type JobPayload,
} from "@/services/adminJobService";

export default function AdminJobsPage() {
  const router = useRouter();

  const [staff, setStaff] = useState<Staff | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const [form, setForm] = useState<JobPayload>({
    title: "",
    track: "",
    description: "",
    requiredSkills: [],
    isOpen: true,
  });

  const [skillsInput, setSkillsInput] = useState("");

  // Verify staff
  useEffect(() => {
    let active = true;

    const checkStaff = async () => {
      try {
        const currentStaff = await verifyStaff();

        if (active) setStaff(currentStaff);
      } catch (err) {
        console.error("Staff authentication error:", err);
        staffLogout();
        router.replace("/admin/login");
      }
    };

    checkStaff();

    return () => {
      active = false;
    };
  }, [router]);

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllJobs();
      setJobs(data);
    } catch (err) {
      console.error("Fetch jobs error:", err);
      setError("Unable to load job postings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (staff) fetchJobs();
  }, [staff]);

  // Reset form
  const resetForm = () => {
    setForm({
      title: "",
      track: "",
      description: "",
      requiredSkills: [],
      isOpen: true,
    });

    setSkillsInput("");
    setEditingJob(null);
    setError("");
  };

  // Open create modal
  const openCreateModal = () => {
    resetForm();
    setModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (job: Job) => {
    setEditingJob(job);

    setForm({
      title: job.title,
      track: job.track,
      description: job.description || "",
      requiredSkills: job.requiredSkills,
      isOpen: job.isOpen,
    });

    setSkillsInput(job.requiredSkills.join(", "));
    setModalOpen(true);
  };

  // Save job
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (saving) return;

    const skills = skillsInput
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      setError("Please enter at least one required skill.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const payload: JobPayload = {
        ...form,
        title: form.title.trim(),
        track: form.track.trim(),
        description: form.description.trim(),
        requiredSkills: [...new Set(skills)],
      };

      if (editingJob) {
        await updateJob(editingJob._id, payload);
        setSuccess("Job updated successfully!");
      } else {
        await createJob(payload);
        setSuccess("Job created successfully!");
      }

      setModalOpen(false);
      resetForm();

      await fetchJobs();
    } catch (err) {
      console.error("Save job error:", err);
      setError("Unable to save job. Please check the form and try again.");
    } finally {
      setSaving(false);
    }
  };

  // Search jobs
  const filteredJobs = jobs.filter((job) => {
    const query = search.toLowerCase();

    return (
      job.title.toLowerCase().includes(query) ||
      job.track.toLowerCase().includes(query) ||
      job.requiredSkills.some((skill) =>
        skill.toLowerCase().includes(query)
      )
    );
  });

  if (!staff) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3f3f1]">
        <p className="text-sm text-gray-500">
          Verifying staff authentication...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f3f1] lg:flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-w-0 flex-1">
        <AdminHeader
          onMenuClick={() => setSidebarOpen(true)}
          staffEmail={staff.email}
        />

        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">

          {/* Heading */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-[#ff735f]">
                Staff workspace
              </p>

              <h1 className="mt-3 text-3xl font-semibold">
                Manage Jobs
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Create, update and manage recruitment opportunities.
              </p>
            </div>

            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 rounded-full bg-[#292929] px-5 py-3 text-xs text-white transition hover:bg-black"
            >
              <Plus size={16} />
              Create New Job
            </button>
          </div>

          {/* Notifications */}
          {success && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {success}
            </div>
          )}

          {error && !modalOpen && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Job summary */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="surface-card p-6">
              <p className="text-xs text-gray-500">Total Job Postings</p>
              <p className="mt-4 text-3xl font-semibold">
                {jobs.length}
              </p>
            </div>

            <div className="surface-card p-6">
              <p className="text-xs text-gray-500">Active Vacancies</p>
              <p className="mt-4 text-3xl font-semibold">
                {jobs.filter((job) => job.isOpen).length}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="surface-card mt-8 flex items-center gap-3 p-4">
            <Search size={18} className="text-gray-400" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search jobs, tracks or skills..."
              className="w-full bg-transparent text-sm outline-none"
            />

            <button
              onClick={fetchJobs}
              disabled={loading}
              aria-label="Refresh jobs"
              className="rounded-lg p-2 hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw size={17} />
            </button>
          </div>

          {/* Job list */}
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {loading ? (
              <p className="col-span-full py-12 text-center text-sm text-gray-400">
                Loading job postings...
              </p>
            ) : filteredJobs.length === 0 ? (
              <div className="surface-card col-span-full p-12 text-center">
                <BriefcaseBusiness className="mx-auto text-gray-300" size={32} />
                <p className="mt-4 text-sm font-medium">No jobs found</p>
                <p className="mt-2 text-xs text-gray-400">
                  Create a job posting or change your search.
                </p>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <article key={job._id} className="surface-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-400">
                        {job.track}
                      </p>

                      <h2 className="mt-2 text-lg font-semibold">
                        {job.title}
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1.5 text-[10px] ${
                        job.isOpen
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {job.isOpen ? "Active" : "Closed"}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-500">
                    {job.description || "No description provided."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-gray-200 px-3 py-1.5 text-[10px] text-gray-600"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                    <p className="text-xs text-gray-400">
                      {job.requiredSkills.length} required skills
                    </p>

                    <button
                      onClick={() => openEditModal(job)}
                      className="flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-xs hover:border-[#ff735f] hover:text-[#e76552]"
                    >
                      <Pencil size={13} />
                      Edit Job
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Create/Edit Job Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  {editingJob ? "Edit Job Posting" : "Create New Job"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Enter the job details and required skills.
                </p>
              </div>

              <button
                onClick={() => {
                  setModalOpen(false);
                  resetForm();
                }}
                aria-label="Close modal"
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">

              <div>
                <label className="mb-2 block text-xs font-medium">
                  Job Title
                </label>

                <input
                  value={form.title}
                  onChange={(event) =>
                    setForm({ ...form, title: event.target.value })
                  }
                  placeholder="e.g. Frontend Developer"
                  required
                  maxLength={120}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#ff735f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium">
                  Job Track
                </label>

                <input
                  value={form.track}
                  onChange={(event) =>
                    setForm({ ...form, track: event.target.value })
                  }
                  placeholder="e.g. Software Development"
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#ff735f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium">
                  Job Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  placeholder="Describe the role and responsibilities..."
                  rows={5}
                  required
                  maxLength={5000}
                  className="w-full resize-y rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#ff735f]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium">
                  Required Skills
                </label>

                <input
                  value={skillsInput}
                  onChange={(event) => setSkillsInput(event.target.value)}
                  placeholder="React, JavaScript, HTML, CSS"
                  required
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#ff735f]"
                />

                <p className="mt-2 text-[10px] text-gray-400">
                  Separate skills using commas.
                </p>
              </div>

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.isOpen}
                  onChange={(event) =>
                    setForm({ ...form, isOpen: event.target.checked })
                  }
                  className="h-4 w-4 accent-[#ff735f]"
                />

                Keep this job posting active
              </label>

              {error && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-full border border-gray-200 px-6 py-3 text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[#292929] px-6 py-3 text-xs text-white hover:bg-black disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingJob
                      ? "Update Job"
                      : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
