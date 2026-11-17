
import Link from "next/link";
import type { Job } from "@/services/jobService";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <article className="surface-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400">
            {job.track}
          </p>

          <h2 className="mt-3 text-lg font-semibold">
            {job.title}
          </h2>
        </div>

        <span className="text-gray-400">↗</span>
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-500 line-clamp-2">
        {job.description || "Explore this opportunity and its required skills."}
      </p>

      <div className="mt-5">
        <p className="mb-2 text-[10px] uppercase tracking-widest text-gray-400">
          Required skills
        </p>

        <div className="flex flex-wrap gap-2">
          {job.requiredSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-[11px] text-gray-600"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-2 border-t border-gray-100 pt-4">
        <Link
          href={`/jobs/${job._id}`}
          className="flex-1 rounded-full border border-gray-200 py-2.5 text-center text-xs hover:bg-gray-100"
        >
          View details
        </Link>

        <Link
          href={`/apply/${job._id}`}
          className="flex-1 rounded-full bg-[#ddf2ba] py-2.5 text-center text-xs text-white hover:bg-[#c9ddb4] border-2 border-[#460808]"
        >
          Apply now ↗
        </Link>
      </div>
    </article>
  );
}
