
import Link from "next/link";
import {
  Search,
  FileText,
  BrainCircuit,
  ChartNoAxesCombined,
  ArrowRight,
  CheckCircle2,
  BriefcaseBusiness,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore Opportunities",
    description:
      "Browse available job openings, explore role descriptions, and find opportunities that match your career interests.",
    icon: Search,
    tag: "Discover roles",
  },
  {
    number: "02",
    title: "Submit Your Application",
    description:
      "Choose a position, enter your details, and paste your resume content to apply for the opportunity.",
    icon: FileText,
    tag: "Apply in minutes",
  },
  {
    number: "03",
    title: "Analyze Your Skills",
    description:
      "Our skill-matching system compares your resume with the job's required skills and identifies matching and missing skills.",
    icon: BrainCircuit,
    tag: "Skill analysis",
  },
  {
    number: "04",
    title: "Understand Your Match",
    description:
      "Get a match percentage along with a clear breakdown of your matched and missing skills.",
    icon: ChartNoAxesCombined,
    tag: "Get insights",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 bg-[#f3f3f1] px-5 py-24 sm:px-8 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#ff735f]/20 bg-[#ffe3dc] px-4 py-2 text-xs font-semibold uppercase tracking-widest text-[#f26754]">
            <span className="h-2 w-2 rounded-full bg-[#ff735f]" />
            Simple. Smart. Transparent.
          </span>

          <h2 className="mt-6 text-4xl font-semibold tracking-tight text-[#252525] sm:text-5xl">
            Your next opportunity,
            <span className="text-[#ff735f]"> made simpler.</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-gray-500">
            From discovering opportunities to understanding your skill
            compatibility, ArchintX makes your job application journey
            more transparent.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-[#e5e5e2] bg-[#fafaf9] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#ff735f]/40 hover:shadow-xl hover:shadow-[#ff735f]/5"
              >
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold tracking-widest text-[#ff735f]">
                    {step.number}
                  </span>

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffe3dc] text-[#ff735f] transition-transform duration-300 group-hover:scale-110">
                    <Icon size={23} strokeWidth={1.7} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="mt-8 text-xl font-semibold text-[#252525]">
                  {step.title}
                </h3>

                <p className="mt-4 min-h-[105px] text-sm leading-7 text-gray-500">
                  {step.description}
                </p>

                {/* Tag */}
                <div className="mt-7 flex items-center gap-2 border-t border-gray-100 pt-5">
                  <CheckCircle2 size={15} className="text-[#ff735f]" />
                  <span className="text-xs font-medium text-gray-500">
                    {step.tag}
                  </span>
                </div>

                {/* Step connector */}
                {index !== steps.length - 1 && (
                  <div className="absolute -right-4 top-14 z-10 hidden text-[#ff735f] lg:block">
                    <ArrowRight size={19} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 overflow-hidden rounded-3xl bg-[#252525] px-7 py-12 sm:px-12">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-[#ff9a88]">
                <BriefcaseBusiness size={17} />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Your career starts here
                </span>
              </div>

              <h3 className="mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                Ready to find your
                <span className="text-[#ff9a88]"> next opportunity?</span>
              </h3>

              <p className="mt-4 text-sm leading-7 text-gray-400">
                Explore open positions and discover how your skills
                align with the opportunities waiting for you.
              </p>
            </div>

            <Link
              href="/jobs"
              className="group flex shrink-0 items-center gap-3 rounded-full bg-[#ff735f] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#f45f4b]"
            >
              Explore Jobs
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
