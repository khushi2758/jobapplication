
"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Mail,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
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

// Application details content
function ApplicationDetailsContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const applicationId = params.id;

  const [staff, setStaff] = useState<Staff | null>(null);
  const [application, setApplication] =
    useState<AdminApplication | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Verify staff authentication
  useEffect(() => {
    let active = true;

    const checkStaff = async () => {
      try {
        const currentStaff = await verifyStaff();

        if (active) {
          setStaff(currentStaff);
        }
      } catch (err) {
        console.error("Authentication error:", err);

        staffLogout();
        router.replace("/admin/login");
      }
    };

    checkStaff();

    return () => {
      active = false;
    };
  }, [router]);

  // Fetch application details
  useEffect(() => {
    if (!staff || !applicationId) return;

    let active = true;

    const fetchApplication = async () => {
      try {
        setLoading(true);
        setError("");

        const applications = await getApplications();

        const selectedApplication = applications.find(
          (item) => item._id === applicationId
        );

        if (!selectedApplication) {
          throw new Error("Application not found.");
        }

        if (active) {
          setApplication(selectedApplication);
        }
      } catch (err) {
        console.error("Application details error:", err);

        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load application details."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchApplication();

    return () => {
      active = false;
    };
  }, [staff, applicationId]);

  // Authentication loading state
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

          {/* Back navigation */}
          <Link
            href="/admin/dashboard/applications"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-[#ff735f]"
          >
            <ArrowLeft size={16} />
            Back to applications
          </Link>

          {/* Page heading */}
          <div className="mt-7">
            <p className="text-xs uppercase tracking-widest text-[#ff735f]">
              Candidate profile
            </p>

            <h1 className="mt-3 text-3xl font-semibold">
              Application Details
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Review candidate information and skill compatibility.
            </p>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="surface-card mt-8 p-12 text-center">
              <p className="text-sm text-gray-400">
                Loading candidate details...
              </p>
            </div>
          ) : error ? (
            /* Error */
            <div
              role="alert"
              className="surface-card mt-8 p-8 text-center"
            >
              <p className="text-sm text-red-500">{error}</p>

              <button
                onClick={() => router.back()}
                className="mt-5 text-xs text-[#ff735f]"
              >
                Go back
              </button>
            </div>
          ) : application ? (
            <>
              {/* Candidate information */}
              <div className="surface-card mt-8 p-6 sm:p-8">
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {application.name}
                    </h2>

                    <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500">
                      <p className="flex items-center gap-2">
                        <Mail size={16} />
                        {application.email}
                      </p>

                      <p className="flex items-center gap-2">
                        <BriefcaseBusiness size={16} />
                        {application.jobId?.title || "Job unavailable"}
                      </p>

                      <p className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        Applied on{" "}
                        {new Date(
                          application.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-green-50 px-4 py-2 text-xs font-medium text-green-700">
                    Application received
                  </span>
                </div>
              </div>

              {/* Match score */}
              <div className="surface-card mt-6 flex flex-col items-center p-8">
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Resume compatibility
                </p>

                <div className="mt-5 flex h-36 w-36 flex-col items-center justify-center rounded-full border-[8px] border-[#ff735f]">
                  <span className="text-4xl font-semibold">
                    {application.matchScore}%
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    Match score
                  </span>
                </div>

                <p className="mt-4 text-sm text-gray-500">
                  Based on the job&apos;s required skills.
                </p>
              </div>

              {/* Skills analysis */}
              <div className="mt-6 grid gap-6 md:grid-cols-2">

                {/* Matched skills */}
                <div className="surface-card p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={19}
                      className="text-green-600"
                    />

                    <h3 className="font-semibold">
                      Matched Skills ({application.matchedSkills.length})
                    </h3>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {application.matchedSkills.length > 0 ? (
                      application.matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-green-50 px-3 py-2 text-xs text-green-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">
                        No matching skills found.
                      </p>
                    )}
                  </div>
                </div>

                {/* Missing skills */}
                <div className="surface-card p-6">
                  <div className="flex items-center gap-2">
                    <AlertCircle
                      size={19}
                      className="text-orange-500"
                    />

                    <h3 className="font-semibold">
                      Missing Skills ({application.missingSkills.length})
                    </h3>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {application.missingSkills.length > 0 ? (
                      application.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-orange-50 px-3 py-2 text-xs text-orange-700"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">
                        No missing skills.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="surface-card mt-6 p-6 sm:p-8">
                <div className="flex items-center gap-3">
                  <FileText
                    size={20}
                    className="text-[#ff735f]"
                  />

                  <h3 className="font-semibold">
                    Candidate Resume
                  </h3>
                </div>

                <div className="mt-5 whitespace-pre-wrap break-words rounded-xl bg-[#fafaf9] p-5 text-sm leading-7 text-gray-600">
                  {application.resumeText}
                </div>
              </div>
            </>
          ) : null}
        </section>
      </div>
    </main>
  );
}

// Page wrapper: required for useParams() prerendering
export default function ApplicationDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f3f3f1]">
          <p className="text-sm text-gray-500">
            Loading application details...
          </p>
        </main>
      }
    >
      <ApplicationDetailsContent />
    </Suspense>
  );
}
