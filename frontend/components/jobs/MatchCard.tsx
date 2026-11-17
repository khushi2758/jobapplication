
import Link from "next/link";

interface MatchCardProps {
  title: string;
  company: string;
  score?: number;
  jobId: string;
  skills: string[];
}

export default function MatchCard({
  title,
  company,
  score,
  jobId,
  skills,
}: MatchCardProps) {
  const hasScore =
    typeof score === "number" &&
    Number.isFinite(score) &&
    score >= 0 &&
    score <= 100;

  return (
    <article className="surface-card group min-w-0 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">
            {title}
          </h3>
          <p className="mt-1 text-xs muted-text">
            {company}
          </p>
        </div>

        <span className="text-gray-400 transition-transform group-hover:translate-x-1">
          ↗
        </span>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <div
          className="match-circle"
          aria-label={
            hasScore
              ? `${score}% skill match`
              : "Skill match not yet analyzed"
          }
        >
          {hasScore ? (
            <>
              <span>{score}%</span>
              <span>Skill Match</span>
            </>
          ) : (
            <>
              <span className="text-xl">—</span>
              <span>Not analyzed</span>
            </>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          {skills.slice(0, 3).map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-2 text-xs text-gray-500"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff735f]" />
              <span className="truncate">{skill}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href={`/jobs/${jobId}`}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-gray-200 py-2.5 text-xs font-medium transition-colors hover:border-[#ff735f] hover:bg-[#fff3f0]"
      >
        View opportunity
      </Link>
    </article>
  );
}
