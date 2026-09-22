import JobsClient from "./JobsClient";

// Next.js ISR: Statically pre-rendered with 60-second background revalidation
export const revalidate = 60;

export default function JobsPage() {
  return <JobsClient />;
}
