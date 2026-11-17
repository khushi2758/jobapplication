
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import {
  verifyStaff,
  staffLogout,
  type Staff,
} from "@/services/authService";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [staff, setStaff] = useState<Staff | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const checkAuthentication = async () => {
      try {
        const currentStaff = await verifyStaff();

        if (active) setStaff(currentStaff);
      } catch (error) {
        console.error("Authentication failed:", error);
        staffLogout();
        router.replace("/admin/login");
      } finally {
        if (active) setLoading(false);
      }
    };

    checkAuthentication();

    return () => {
      active = false;
    };
  }, [router]);

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
          <div>
            <p className="text-xs uppercase tracking-widest text-[#ff735f]">
              Staff workspace
            </p>

            <h2 className="mt-3 text-3xl font-semibold">
              Welcome back!
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Here's an overview of your recruitment activities.
            </p>
          </div>

          {/* Statistics */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[
              "Total Applications",
              "Active Job Postings",
              "Average Match Score",
            ].map((title) => (
              <div
                key={title}
                className="surface-card p-6"
              >
                <p className="text-xs text-gray-500">{title}</p>

                <p className="mt-5 text-3xl font-semibold text-gray-400">
                  —
                </p>

                <p className="mt-2 text-[10px] text-gray-400">
                  Awaiting live data integration
                </p>
              </div>
            ))}
          </div>

          {/* Application overview */}
          <div className="surface-card mt-8 p-6 sm:p-8">
            <h3 className="text-lg font-semibold">
              Application Management
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Manage candidate applications, review resumes and
              analyze skill matches.
            </p>

            <p className="mt-6 text-xs text-gray-400">
              Application data integration is our next step.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
