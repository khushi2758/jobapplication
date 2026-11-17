
import { Suspense } from "react";
import ApplicationForm from "@/components/application/ApplicationForm";

interface ApplyPageProps {
  params: Promise<{
    jobId: string;
  }>;
}

async function ApplyPageContent({ params }: ApplyPageProps) {
  const { jobId } = await params;

  return <ApplicationForm jobId={jobId} />;
}

export default function ApplyPage({ params }: ApplyPageProps) {
  return (
    <Suspense
      fallback={
        <main className="dashboard-container">
          <p className="py-20 text-center text-sm text-gray-400">
            Loading application form...
          </p>
        </main>
      }
    >
      <ApplyPageContent params={params} />
    </Suspense>
  );
}
