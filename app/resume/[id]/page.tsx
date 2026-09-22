import PublicResumeClient from "./PublicResumeClient";

// Next.js ISR: Revalidated every 60 seconds
export const revalidate = 60;

// Enable on-demand ISR fallback for all candidate resume links
export const dynamicParams = true;

/**
 * On-demand generation for resume profiles without forcing build-time static generation.
 */
export async function generateStaticParams() {
  return [];
}

export default function PublicResumePage({ params }: { params: { id: string } }) {
  return <PublicResumeClient id={params.id} />;
}
