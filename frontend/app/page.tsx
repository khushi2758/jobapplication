
import Navbar from "@/components/common/Navbar";
import MatchChart from "@/components/jobs/MatchChart";
import JobMatchSection from "@/components/jobs/JobMatchSection";
import HowItWorks from "@/components/common/HowItWorks";

export default function Home() {
  return (
    <main className="dashboard-container">
      <Navbar />

      {/* Hero section */}
      <section className="grid grid-cols-1 items-center gap-8 py-12 lg:grid-cols-2 lg:py-16">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[10px] text-gray-600">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff735f]" />
            AI - Powered
          </div>

          <h1 className="text-5xl font-light leading-[1.08] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
            YOUR JOB
            <br />
            <span className="font-semibold">MATCH.</span>
          </h1>

          <p className="mt-5 max-w-sm text-sm leading-7 text-gray-500">
            Discover opportunities that match your skills.
            Understand your strengths and identify the skills
            you need to grow your career.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/jobs"
              className="rounded-full bg-[#c5ec9e] px-6 py-3 text-xs font-medium text-white transition hover:bg-[#c9ddb4] border-2 border-[#460808] hover:text-white"
            >
              Explore vacancies ↗
            </a>

            <a
              href="/jobs"
              className="rounded-full border border-gray-300 bg-white px-6 py-3 text-xs font-medium hover:bg-gray-100"
            >
              Analyze your skills
            </a>
          </div>
        </div>

        <div className="relative">
          <MatchChart />

          <div className="absolute right-0 top-0 hidden w-44 space-y-2 md:block">
            <div className="surface-card p-3">
              <p className="text-xs font-medium">Talent insights</p>
              <p className="mt-2 text-[10px] leading-5 muted-text">
                Explore roles, skills and career opportunities.
              </p>
            </div>

            <div className="surface-card p-3">
              <p className="text-xs font-medium">Skill analysis</p>
              <p className="mt-2 text-[10px] leading-5 muted-text">
                Discover your strengths and skill gaps.
              </p>
            </div>

            <div className="surface-card p-3">
              <p className="text-xs font-medium">Career growth</p>
              <p className="mt-2 text-[10px] leading-5 muted-text">
                Find opportunities that support your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job cards */}
      <JobMatchSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Bottom information */}
      <section className="mt-10 rounded-2xl border border-gray-200 bg-[#eaeae7] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-500">
              Take the next step
            </p>

            <h2 className="mt-2 text-2xl font-medium tracking-tight">
              Know where you stand.
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
              Submit your resume to discover matched skills,
              missing skills and your job match percentage.
            </p>
          </div>

          <a
            href="/jobs"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-xs font-medium hover:bg-gray-100"
          >
            Find your match ↗
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        © 2026 ArchintX. Find your next opportunity.
      </footer>
    </main>
  );
}
