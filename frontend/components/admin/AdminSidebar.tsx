
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  LogOut,
  X,
} from "lucide-react";
import { staffLogout } from "@/services/authService";

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  {
    label: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Applications",
    href: "/admin/dashboard/applications",
    icon: Users,
  },
  {
    label: "Manage Jobs",
    href: "/admin/dashboard/jobs",
    icon: BriefcaseBusiness,
  },
];

export default function AdminSidebar({
  isOpen = true,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    staffLogout();
    router.replace("/admin/login");
  };

  return (
    <>
      {isOpen && (
        <button
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-gray-200 bg-white p-6 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-xl font-bold tracking-widest">
            ARCHINTX<span className="text-[#ff735f]">.</span>
          </Link>

          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-12 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
          Workspace
        </p>

        <nav className="mt-5 flex-1 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-[#ffe3dc] font-medium text-[#e76552]"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </button>

        <p className="mt-5 text-[10px] text-gray-400">
          © 2026 ArchintX
        </p>
      </aside>
    </>
  );
}
