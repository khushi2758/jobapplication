
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { staffLogin } from "@/services/authService";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError("");

  try {
    setLoading(true);

    const response = await staffLogin({
      email: email.trim().toLowerCase(),
      password: password,
    });

    console.log("Staff login successful:", response.staff);

    router.replace("/admin/dashboard");
  } catch (err: unknown) {
    console.error("Staff login error:", err);

    setError("Invalid email or password. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-[#f3f3f1] px-5 py-10">
      <div className="mx-auto flex min-h-[85vh] max-w-6xl items-center justify-center">

        <div className="grid w-full overflow-hidden rounded-3xl bg-white shadow-sm md:grid-cols-2">

          {/* Left section */}
          <div className="flex flex-col justify-between bg-[#292929] p-8 text-white sm:p-12">
            <Link href="/" className="text-xl font-bold tracking-widest">
              ARCHINTX<span className="text-[#ff735f]">.</span>
            </Link>

            <div className="my-16">
              <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
                Staff workspace
              </p>

              <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
                Manage talent.
                <br />
                Find potential.
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
                Access candidate applications, evaluate skill matches
                and manage your recruitment opportunities.
              </p>
            </div>

            <p className="text-xs text-gray-500">
              © 2026 ArchintX. All rights reserved.
            </p>
          </div>

          {/* Right section */}
          <div className="flex items-center justify-center p-8 sm:p-12">
            <div className="w-full max-w-md">

              <p className="text-xs font-medium uppercase tracking-widest text-[#ff735f]">
                Admin portal
              </p>

              <h2 className="mt-4 text-3xl font-semibold">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Sign in to access your staff dashboard.
              </p>

              <form onSubmit={handleLogin} className="mt-9 space-y-6">

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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@archintx.com"
                    required
                    autoComplete="username"
                    className="w-full rounded-xl border border-gray-200 bg-[#fafaf9] px-4 py-3.5 text-sm outline-none transition focus:border-[#ff735f]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-xs font-medium"
                  >
                    Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-gray-200 bg-[#fafaf9] px-4 py-3.5 text-sm outline-none transition focus:border-[#ff735f]"
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#292929] px-6 py-4 text-xs font-medium text-white transition hover:bg-[#ff735f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Sign in to dashboard →"}
                </button>

              </form>

              <p className="mt-8 text-center text-xs text-gray-400">
                Authorized staff only.
              </p>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
