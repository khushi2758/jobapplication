
"use client";

import { Menu, Bell, UserCircle } from "lucide-react";

interface AdminHeaderProps {
  onMenuClick: () => void;
  staffEmail?: string;
}

export default function AdminHeader({
  onMenuClick,
  staffEmail,
}: AdminHeaderProps) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-gray-200 bg-white px-5 sm:px-8">

      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-[#292929]">
            Dashboard Overview
          </h1>
          <p className="hidden text-xs text-gray-400 sm:block">
            Manage your recruitment activities
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff735f]" />
        </button>

        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
          <UserCircle size={30} className="text-gray-500" />

          <div className="hidden sm:block">
            <p className="max-w-[180px] truncate text-xs font-semibold">
              Staff Admin
            </p>
            <p className="max-w-[180px] truncate text-[10px] text-gray-400">
              {staffEmail || "Admin account"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
