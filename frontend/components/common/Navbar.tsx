
"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Find Jobs", href: "/jobs" },
  { label: "How It Works", href: "/#how-it-works" },
];

function NavbarContent() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";

    if (href === "/#how-it-works") return false;

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/70 bg-[#f3f3f1]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-8 lg:px-16">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          <span className="text-[#ff735f]">A</span>rchintX
          <span className="text-[#ff735f]">.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full px-5 py-2.5 text-sm transition-all duration-200 ${
                  active
                    ? "bg-white font-medium text-[#252525] shadow-sm"
                    : "text-gray-500 hover:bg-white/80 hover:text-[#252525]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/admin/login"
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:text-[#ff735f]"
          >
            <BriefcaseBusiness size={16} />
            Employer Login
          </Link>

          <Link
            href="/jobs"
            className="group flex items-center gap-2 rounded-full bg-[#ff735f] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#f45f4b]"
          >
            Explore Jobs
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-gray-700 hover:bg-white md:hidden"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-[#f3f3f1] px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm transition ${
                  isActive(item.href)
                    ? "bg-white font-semibold text-[#ff735f]"
                    : "text-gray-600 hover:bg-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 border-t border-gray-200" />

            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-gray-600 hover:bg-white"
            >
              <BriefcaseBusiness size={17} />
              Employer Login
            </Link>

            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 rounded-xl bg-[#ff735f] px-4 py-3 text-center text-sm font-medium text-white"
            >
              Explore Jobs
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

// Suspense boundary for Next.js URL data
export default function Navbar() {
  return (
    <Suspense
      fallback={
        <header className="flex items-center justify-between border-b border-gray-200/70 px-5 py-4 md:px-8 lg:px-16">
          <span className="text-2xl font-bold tracking-tight">
            <span className="text-[#ff735f]">A</span>rchintX.
          </span>
        </header>
      }
    >
      <NavbarContent />
    </Suspense>
  );
}
