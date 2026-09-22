import JobDetailClient from "./JobDetailClient";
import { JobRepository } from "@/lib/repositories";

// Next.js ISR: Statically revalidated every 60 seconds
export const revalidate = 60;

// Enable on-demand ISR for jobs not pre-rendered at build time (equivalent to fallback: 'blocking')
export const dynamicParams = true;

/**
 * Pre-generate static params for the most recent/viewed published jobs.
 * All other job IDs are generated on-demand and cached via ISR.
 */
export async function generateStaticParams() {
  try {
    const jobs = await JobRepository.findMany({ status: "published" });
    return (jobs || []).slice(0, 10).map((j: any) => ({
      id: String(j._id),
    }));
  } catch {
    return [];
  }
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  return <JobDetailClient jobId={params.id} />;
}
