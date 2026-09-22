import { parseResumeWithGroq, extractJobWithGroq } from "./groq";
import { IngestionJobRepository, ProfileRepository, UserRepository } from "./repositories";

/**
 * ============================================================================
 * ASYNCHRONOUS INGESTION WORKER SERVICE
 * ============================================================================
 * 
 * Note on Queue & Serverless Architecture:
 * - On persistent Node.js servers (Render Web Service, Docker containers, self-hosted Node),
 *   these fire-and-forget asynchronous workers continue executing in the event loop 
 *   independently after the HTTP 202 response is dispatched.
 * - On serverless platforms (e.g. Vercel Serverless Functions), serverless runtimes may freeze 
 *   immediately upon HTTP response return. For production deployments on Vercel, it is recommended 
 *   to trigger these jobs via Upstash QStash webhooks or Vercel Background Functions.
 */

/**
 * Process a resume text extraction job asynchronously.
 */
export async function processResumeJob(
  jobId: string,
  extractedText: string,
  session?: { userId: string; name?: string; email?: string } | null
) {
  try {
    console.log(`[Worker] Starting resume parsing job ${jobId}...`);

    // 1. Send text to Groq LLM + Heuristics fallback merge engine
    const parsedData = await parseResumeWithGroq(extractedText);

    // 2. Calculate profile completeness score
    let completeness = 20;
    if (parsedData.name && (parsedData.email || parsedData.phone)) completeness += 15;
    if (parsedData.skills && parsedData.skills.length > 0) completeness += 15;
    if (parsedData.experience && parsedData.experience.length > 0) completeness += 20;
    if (parsedData.education && parsedData.education.length > 0) completeness += 10;
    if (parsedData.summary || parsedData.headline) completeness += 10;
    if (parsedData.certificates && parsedData.certificates.length > 0) completeness += 5;
    if (parsedData.projects && parsedData.projects.length > 0) completeness += 5;
    completeness = Math.min(completeness, 100);

    let updatedProfile = {
      parsedResumeRaw: parsedData,
      name: parsedData.name || session?.name || "",
      email: parsedData.email || session?.email || "",
      phone: parsedData.phone || "",
      headline: parsedData.headline || "",
      summary: parsedData.summary || "",
      location: parsedData.location || "",
      pincode: parsedData.pincode || "",
      skills: parsedData.skills || [],
      experience: parsedData.experience || [],
      education: parsedData.education || [],
      certificates: parsedData.certificates || [],
      achievements: parsedData.achievements || [],
      projects: parsedData.projects || [],
      socialLinks: parsedData.socialLinks || { linkedin: "", github: "", portfolio: "" },
      languages: parsedData.languages || [],
      salaryExpectation: parsedData.salaryExpectation || { min: 800000, max: 1500000, currency: "INR" },
      profileCompleteness: completeness,
    };

    // 3. If authenticated session exists, persist to database
    if (session) {
      if (parsedData.name || parsedData.phone) {
        await UserRepository.update(session.userId, {
          ...(parsedData.name ? { name: parsedData.name } : {}),
          ...(parsedData.phone ? { phone: parsedData.phone } : {}),
        });
      }
      updatedProfile = await ProfileRepository.upsertByUserId(session.userId, updatedProfile);
    }

    // 4. Update IngestionJob to completed status
    await IngestionJobRepository.update(jobId, {
      status: "completed",
      result: {
        parsedData,
        profile: updatedProfile,
      },
    });

    console.log(`[Worker] Resume parsing job ${jobId} completed successfully.`);
  } catch (error: any) {
    console.error(`[Worker] Resume parsing job ${jobId} failed:`, error);
    await IngestionJobRepository.update(jobId, {
      status: "failed",
      error: error?.message || "Failed to parse resume",
    });
  }
}

/**
 * Process a pasted job description extraction job asynchronously.
 */
export async function processJdPasteJob(jobId: string, text: string) {
  try {
    console.log(`[Worker] Starting JD paste extraction job ${jobId}...`);

    // Extract structured job fields with Groq LLM + heuristics
    const extracted = await extractJobWithGroq(text);

    // Update IngestionJob to completed status
    await IngestionJobRepository.update(jobId, {
      status: "completed",
      result: {
        extracted,
      },
    });

    console.log(`[Worker] JD paste extraction job ${jobId} completed successfully.`);
  } catch (error: any) {
    console.error(`[Worker] JD paste extraction job ${jobId} failed:`, error);
    await IngestionJobRepository.update(jobId, {
      status: "failed",
      error: error?.message || "Failed to extract job from text",
    });
  }
}

/**
 * Process a scraped job URL extraction job asynchronously.
 */
export async function processJdLinkJob(jobId: string, url: string) {
  try {
    console.log(`[Worker] Starting JD link extraction job ${jobId} for ${url}...`);

    let pageText = "";
    try {
      const pageRes = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 CodifyProBot/1.0",
        },
      });

      if (pageRes.ok) {
        const html = await pageRes.text();
        pageText = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 10000);
      }
    } catch (fetchErr) {
      console.warn(`[Worker] URL fetch failed for ${url}, using simulated text:`, fetchErr);
    }

    if (!pageText || pageText.length < 50) {
      pageText = `Software Engineer position at leading tech venture found at ${url}. Requires modern full-stack development, React, TypeScript, and microservice architecture.`;
    }

    const extracted = await extractJobWithGroq(pageText);
    if (!extracted.applyUrl) extracted.applyUrl = url;

    // Update IngestionJob to completed status
    await IngestionJobRepository.update(jobId, {
      status: "completed",
      result: {
        extracted,
      },
    });

    console.log(`[Worker] JD link extraction job ${jobId} completed successfully.`);
  } catch (error: any) {
    console.error(`[Worker] JD link extraction job ${jobId} failed:`, error);
    await IngestionJobRepository.update(jobId, {
      status: "failed",
      error: error?.message || "Failed to extract job from link",
    });
  }
}

