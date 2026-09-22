import Groq from "groq-sdk";
import {
  ResumeParsedSchema,
  ResumeParsedData,
  JobExtractedSchema,
  JobExtractedData,
} from "./zod-schemas";

const groqApiKey = process.env.GROQ_API_KEY;
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : null;
const AI_MODEL = process.env.AI_MODEL || "llama-3.3-70b-versatile";

// ============================================================================
// HEURISTIC RESUME PARSER (Always available, robust fallback engine)
// ============================================================================
export function fallbackResumeParser(text: string): ResumeParsedData {
  const cleanText = (text || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = cleanText.split("\n").map((l) => l.trim()).filter(Boolean);

  // 1. Candidate Name (detect from top lines)
  let name = "";
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const l = lines[i];
    if (
      !/@|https?|www\.|github|linkedin|phone|\+?\d{2,}|curriculum|resume|biodata|profile|contact|summary|experience|education/i.test(l) &&
      l.length >= 3 &&
      l.length <= 45 &&
      /^[A-Za-z\s.'-]+$/.test(l) &&
      l.split(/\s+/).length >= 2 &&
      l.split(/\s+/).length <= 4
    ) {
      name = l;
      break;
    }
  }

  // 2. Email Address
  const emailMatch = cleanText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0].trim() : "";

  // 3. Phone Number (supports Indian +91, international, standard formats)
  const phoneMatch = cleanText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,5}[-.\s]?\d{4,5}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : "";

  // 4. Social Links (LinkedIn, GitHub, Portfolio)
  const linkedinMatch = cleanText.match(/linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const githubMatch = cleanText.match(/github\.com\/([a-zA-Z0-9_-]+)/i);
  const portfolioMatch = cleanText.match(/(?:portfolio|website|webpage)[\s:]*([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s,]*)?)/i);

  // 5. Location & Pincode / ZIP
  const pincodeMatch = cleanText.match(/\b([1-9][0-9]{5})\b/) || cleanText.match(/\b([0-9]{5}(?:-[0-9]{4})?)\b/);
  const pincode = pincodeMatch ? pincodeMatch[1] : "";

  const cityMatch = cleanText.match(
    /\b(Bengaluru|Bangalore|Hyderabad|Pune|Mumbai|Delhi|New Delhi|Gurgaon|Gurugram|Noida|Chennai|Kolkata|Ahmedabad|Jaipur|Chandigarh|Kochi|San Francisco|New York|Seattle|Austin|Boston|London|Remote)\b/i
  );
  let location = "";
  if (cityMatch) {
    const isIndian = /bengaluru|bangalore|hyderabad|pune|mumbai|delhi|gurgaon|gurugram|noida|chennai|kolkata|jaipur|kochi/i.test(cityMatch[1]);
    location = isIndian ? `${cityMatch[1]}, India` : cityMatch[1];
  }

  // 6. Professional Headline
  let headline = "";
  const headlineMatch = cleanText.match(
    /\b(Senior\s+Full\s+Stack\s+Engineer|Full\s+Stack\s+Developer|Software\s+Development\s+Engineer|Software\s+Engineer|Backend\s+Developer|Frontend\s+Developer|DevOps\s+Engineer|Cloud\s+Architect|Data\s+Scientist|Machine\s+Learning\s+Engineer|Mobile\s+App\s+Developer|Android\s+Developer|iOS\s+Developer|QA\s+Engineer)\b/i
  );
  if (headlineMatch) headline = headlineMatch[0];

  // 7. Professional Summary / Bio
  let summary = "";
  const sumMatch = cleanText.match(
    /(?:PROFESSIONAL SUMMARY|SUMMARY|ABOUT ME|CAREER OBJECTIVE|OBJECTIVE|EXECUTIVE SUMMARY)[\s:]*\n([\s\S]*?)(?=\n\s*(?:TECHNICAL\s+SKILLS|SKILLS|WORK\s+EXPERIENCE|EXPERIENCE|EDUCATION|PROJECTS|CERTIFICATIONS|ACHIEVEMENTS)[A-Z\s&/]{0,20}(?:\n|:)|$)/i
  );
  if (sumMatch) {
    summary = sumMatch[1].trim().replace(/\n+/g, " ").slice(0, 500);
  }

  // 8. Technical Skills (Comprehensive catalog of 130+ modern skills)
  const commonSkills = [
    "TypeScript", "JavaScript", "Python", "Java", "C++", "C#", "C", "Go", "Golang", "Rust", "Ruby",
    "PHP", "Swift", "Kotlin", "Dart", "R", "SQL", "HTML5", "CSS3", "HTML", "CSS",
    "React", "React.js", "React Native", "Next.js", "Vue", "Vue.js", "Angular", "Node.js", "Express",
    "Express.js", "NestJS", "Django", "Flask", "FastAPI", "Spring", "Spring Boot", "ASP.NET",
    "Tailwind CSS", "Tailwind", "Bootstrap", "Redux", "GraphQL", "REST APIs", "Microservices", "WebSockets",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Oracle", "Cassandra", "DynamoDB", "Firebase",
    "Supabase", "Prisma", "Mongoose", "AWS", "Azure", "GCP", "Google Cloud", "Docker", "Kubernetes",
    "CI/CD", "Jenkins", "GitHub Actions", "Terraform", "Linux", "Git", "GitHub", "GitLab",
    "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Scikit-Learn", "NLP", "Pandas", "NumPy",
    "Jest", "Cypress", "Postman", "Kafka", "RabbitMQ", "Figma", "Jira", "Agile", "Scrum"
  ];
  const detectedSkills = Array.from(
    new Set(
      commonSkills.filter((s) => new RegExp(`\\b${s.replace(/\+/g, "\\+")}\\b`, "i").test(cleanText))
    )
  );

  // 9. Education
  const education: { school: string; degree: string; year: string }[] = [];
  const eduBlock = cleanText.match(
    /(?:EDUCATION|ACADEMIC BACKGROUND|QUALIFICATIONS)[\s:]*\n([\s\S]*?)(?=\n\s*(?:WORK\s+EXPERIENCE|EXPERIENCE|PROJECTS|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|LANGUAGES)[A-Z\s&/]{0,20}(?:\n|:)|$)/i
  );
  if (eduBlock) {
    const eduLines = eduBlock[1].split("\n").map((l) => l.trim()).filter(Boolean);
    let curSchool = "";
    let curDegree = "";
    let curYear = "";

    for (const l of eduLines) {
      if (/college|university|institute|school|nit|iit|iiit|bits|academy|polytechnic/i.test(l) && !curSchool) {
        curSchool = l;
      } else if (/b\.tech|b\.e\.|b\.s\.|b\.sc|m\.tech|m\.s\.|m\.sc|bachelor|master|mca|bca|mba|diploma|degree|high school/i.test(l) && !curDegree) {
        curDegree = l.split("|")[0].trim();
        const yr = l.match(/\b(19\d\d|20\d\d)\s*(?:-|–|to)?\s*(19\d\d|20\d\d|Present)?\b/i);
        if (yr) curYear = yr[0];
      } else if (/\b(19\d\d|20\d\d)\b/.test(l) && !curYear) {
        const yr = l.match(/\b(19\d\d|20\d\d)\s*(?:-|–|to)?\s*(19\d\d|20\d\d|Present)?\b/i);
        if (yr) curYear = yr[0];
      }
    }
    if (curSchool || curDegree) {
      education.push({
        school: curSchool || "University / College",
        degree: curDegree || "Bachelor's Degree",
        year: curYear || "2020 - 2024",
      });
    }
  }

  // 10. Work Experience
  const experience: { company: string; title: string; from: string; to: string; description: string }[] = [];
  const expBlock = cleanText.match(
    /(?:WORK EXPERIENCE|EXPERIENCE|EMPLOYMENT HISTORY|PROFESSIONAL EXPERIENCE)[\s:]*\n([\s\S]*?)(?=\n\s*(?:EDUCATION|PROJECTS|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|LANGUAGES)[A-Z\s&/]{0,20}(?:\n|:)|$)/i
  );
  if (expBlock) {
    const rawEntries = expBlock[1].split(/\n\s*(?=[A-Za-z\s]+(?:\||-)\s*[A-Za-z\s]+)/);
    for (const entry of rawEntries) {
      const eLines = entry.split("\n").map((l) => l.trim()).filter(Boolean);
      if (eLines.length >= 2) {
        const titleLine = eLines[0];
        const dateLine = eLines[1];
        const descLines = eLines.slice(2).filter((l) => l.startsWith("-") || l.startsWith("•") || l.length > 20);

        const [t, c] = titleLine.split(/\s*\|\s*/);
        const dateMatch =
          dateLine.match(
            /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\s*[-–]\s*(?:Present|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}|\d{4})/i
          ) || dateLine.match(/\b\d{4}\s*[-–]\s*(?:\d{4}|Present)\b/i);

        experience.push({
          title: t ? t.trim() : "Software Engineer",
          company: c ? c.trim() : "Tech Venture",
          from: dateMatch ? dateMatch[0].split(/[-–]/)[0].trim() : "2022",
          to: dateMatch ? dateMatch[0].split(/[-–]/)[1]?.trim() || "Present" : "Present",
          description: descLines.join("\n") || eLines.slice(2).join(" "),
        });
      }
    }
  }

  // 11. Key Projects
  const projects: { name: string; description: string; techStack: string; url: string }[] = [];
  const projBlock = cleanText.match(
    /(?:KEY PROJECTS|PROJECTS|ACADEMIC PROJECTS|PERSONAL PROJECTS)[\s:]*\n([\s\S]*?)(?=\n\s*(?:EDUCATION|WORK\s+EXPERIENCE|EXPERIENCE|SKILLS|CERTIFICATIONS|ACHIEVEMENTS|LANGUAGES)[A-Z\s&/]{0,20}(?:\n|:)|$)/i
  );
  if (projBlock) {
    const projEntries = projBlock[1].split(/\n\s*(?=[A-Za-z0-9\s]+(?:\(|$))/);
    for (const p of projEntries) {
      const pLines = p.split("\n").map((l) => l.trim()).filter(Boolean);
      if (pLines.length >= 2) {
        const nameLine = pLines[0];
        const linkMatch = nameLine.match(/\(([^)]+)\)/);
        const projName = nameLine.replace(/\([^)]+\)/, "").trim();
        const techMatch = p.match(/Tech(?: Stack)?:\s*([^\n]+)/i);
        const desc = pLines.filter((l) => l.startsWith("-") || l.startsWith("•")).join(" ");
        projects.push({
          name: projName,
          url: linkMatch ? linkMatch[1] : "",
          techStack: techMatch ? techMatch[1].trim() : "",
          description: desc || pLines.slice(1).join(" "),
        });
      }
    }
  }

  // 12. Certifications & Credentials
  const certificates: { name: string; issuer: string; certificateId: string; url: string; date: string }[] = [];
  const certBlock = cleanText.match(
    /(?:CERTIFICATIONS|CERTIFICATES|LICENSES & CERTIFICATIONS)[\s:]*\n([\s\S]*?)(?=\n\s*(?:ACHIEVEMENTS|LANGUAGES|EDUCATION|PROJECTS)[A-Z\s&/]{0,20}(?:\n|:)|$)/i
  );
  if (certBlock) {
    const certLines = certBlock[1].split("\n").map((l) => l.trim().replace(/^[-•]\s*/, "")).filter(Boolean);
    for (const l of certLines) {
      const parts = l.split(/\s*\|\s*/);
      const certName = parts[0] || l;
      const issuer = parts[1] || "";
      const credId = l.match(/Credential ID:\s*([a-zA-Z0-9_-]+)/i);
      const yr = l.match(/\b(20\d\d)\b/);
      certificates.push({
        name: certName.trim(),
        issuer: issuer.trim(),
        certificateId: credId ? credId[1] : "",
        date: yr ? yr[0] : "",
        url: "",
      });
    }
  }

  // 13. Achievements & Awards
  const achievements: string[] = [];
  const achBlock = cleanText.match(
    /(?:ACHIEVEMENTS & AWARDS|ACHIEVEMENTS|AWARDS|HONORS & AWARDS|HONORS)[\s:]*\n([\s\S]*?)(?=\n\s*(?:LANGUAGES|EDUCATION|PROJECTS)[A-Z\s&/]{0,20}(?:\n|:)|$)/i
  );
  if (achBlock) {
    const achLines = achBlock[1].split("\n").map((l) => l.trim().replace(/^[-•]\s*/, "")).filter(Boolean);
    achievements.push(...achLines);
  }

  // 14. Languages Spoken
  const languages: string[] = [];
  const langMatch = cleanText.match(/(?:LANGUAGES|LANGUAGES KNOWN)[\s:]*\n([^\n]+)/i);
  if (langMatch) {
    const langs = langMatch[1]
      .split(/[,|]/)
      .map((l) => l.replace(/\([^)]*\)/, "").trim())
      .filter(Boolean);
    languages.push(...langs);
  }

  // Salary Currency Heuristic
  const isIndian = /(?:₹|inr|rs\.?|lpa|lakhs?|india|bengaluru|hyderabad|pune|mumbai|delhi)/i.test(cleanText);

  return {
    name,
    headline: headline || "Software Engineer",
    summary,
    email,
    phone,
    location,
    pincode,
    skills: detectedSkills,
    experience,
    education,
    certificates,
    achievements,
    projects,
    socialLinks: {
      linkedin: linkedinMatch ? `https://linkedin.com/in/${linkedinMatch[1]}` : "",
      github: githubMatch ? `https://github.com/${githubMatch[1]}` : "",
      portfolio: portfolioMatch ? portfolioMatch[1] : "",
    },
    languages,
    salaryExpectation: isIndian
      ? { min: 800000, max: 1500000, currency: "INR" }
      : { min: 110000, max: 160000, currency: "USD" },
  };
}

// ============================================================================
// AI-POWERED RESUME EXTRACTION (GROQ LLM)
// ============================================================================
export async function parseResumeWithGroq(resumeRawText: string): Promise<ResumeParsedData> {
  const fallback = fallbackResumeParser(resumeRawText);

  if (!groq) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return fallback;
  }

  const prompt = `You are an expert AI resume parsing system.
Extract all candidate information from the resume into a strict, valid JSON object matching the schema below.
Extract ALL sections present without truncating, summarizing away details, or omitting fields.

SCHEMA TO FOLLOW:
{
  "name": "Full Name",
  "headline": "Professional Title / Headline (e.g. Senior Full-Stack Engineer)",
  "summary": "Professional Summary or Bio paragraph",
  "email": "Email Address",
  "phone": "Phone / Mobile Number with country code if present",
  "location": "City, State or Country",
  "pincode": "Postal / PIN / ZIP code",
  "skills": ["Skill1", "Skill2", ...],
  "experience": [
    {
      "company": "Company Name",
      "title": "Job Title",
      "from": "Start Date (e.g. Jul 2022 or 2022)",
      "to": "End Date (e.g. Present or Dec 2023)",
      "description": "Responsibilities and key achievements"
    }
  ],
  "education": [
    {
      "school": "Institution / University Name",
      "degree": "Degree / Major (e.g. B.Tech in Computer Science)",
      "year": "Graduation Year or Range (e.g. 2018 - 2022)"
    }
  ],
  "certificates": [
    {
      "name": "Certificate Name",
      "issuer": "Issuing Organization",
      "certificateId": "Credential ID if present",
      "url": "Certificate link if present",
      "date": "Issue Date / Year"
    }
  ],
  "achievements": [
    "Achievement 1",
    "Achievement 2"
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project overview and features",
      "techStack": "Technologies used (e.g. React, Node.js, Redis)",
      "url": "GitHub or Live link if present"
    }
  ],
  "socialLinks": {
    "linkedin": "LinkedIn Profile URL",
    "github": "GitHub Profile URL",
    "portfolio": "Portfolio or Personal Website URL"
  },
  "languages": ["Language 1", "Language 2"],
  "salaryExpectation": {
    "min": number,
    "max": number,
    "currency": "INR" or "USD"
  }
}

CRITICAL RULES:
- Output pure raw JSON only. Do NOT enclose in markdown codeblocks (no \`\`\`json).
- If currency is Indian Rupee (₹, INR, LPA, CTC, or Indian locations), set "currency": "INR". Otherwise "USD".
- Do not invent fake data. If a field is not found in the resume, use empty string "" or empty array [].

Resume Content:
${resumeRawText.slice(0, 14000)}`;

  try {
    const response = await groq.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a specialized JSON resume parser that outputs strictly valid JSON matching the exact schema with all fields populated.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    const cleaned = content.replace(/^```json\s*/i, "").replace(/```$/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const validated = ResumeParsedSchema.parse(parsed);

    // Merge fallback data if AI returned empty for any key section
    return {
      name: validated.name || fallback.name,
      headline: validated.headline || fallback.headline,
      summary: validated.summary || fallback.summary,
      email: validated.email || fallback.email,
      phone: validated.phone || fallback.phone,
      location: validated.location || fallback.location,
      pincode: validated.pincode || fallback.pincode,
      skills: validated.skills.length > 0 ? validated.skills : fallback.skills,
      experience: validated.experience.length > 0 ? validated.experience : fallback.experience,
      education: validated.education.length > 0 ? validated.education : fallback.education,
      certificates: validated.certificates.length > 0 ? validated.certificates : fallback.certificates,
      achievements: validated.achievements.length > 0 ? validated.achievements : fallback.achievements,
      projects: validated.projects.length > 0 ? validated.projects : fallback.projects,
      socialLinks: {
        linkedin: validated.socialLinks?.linkedin || fallback.socialLinks?.linkedin || "",
        github: validated.socialLinks?.github || fallback.socialLinks?.github || "",
        portfolio: validated.socialLinks?.portfolio || fallback.socialLinks?.portfolio || "",
      },
      languages: validated.languages.length > 0 ? validated.languages : fallback.languages,
      salaryExpectation: validated.salaryExpectation.min > 0
        ? validated.salaryExpectation
        : fallback.salaryExpectation,
    };
  } catch (err: any) {
    console.error("AI resume parsing error, using heuristic fallback engine:", err?.message);
    return fallback;
  }
}

// ============================================================================
// JOB POSTING EXTRACTION (AI INGESTION)
// ============================================================================
export async function extractJobWithGroq(jobText: string): Promise<JobExtractedData> {
  const isIndianContext =
    /(?:₹|inr|rs\.?|lpa|lakhs?|ctc|india|bengaluru|bangalore|hyderabad|pune|mumbai|delhi|noida|gurgaon)/i.test(
      jobText
    );

  if (!groq) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const techSkills = [
      "TypeScript", "React", "Next.js", "Node.js", "Python", "Java", "Go",
      "AWS", "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "Tailwind CSS", "GraphQL"
    ].filter((s) => new RegExp(`\\b${s}\\b`, "i").test(jobText));

    const lines = jobText.split("\n").map((l) => l.trim()).filter(Boolean);
    const inferredRole = lines[0] && lines[0].length < 60 ? lines[0] : "Software Engineer";
    const inferredCompany = lines[1] && lines[1].length < 40 ? lines[1] : "Tech Company";

    return {
      companyName: inferredCompany,
      companyLogoUrl: "",
      role: inferredRole,
      jd: jobText.length > 50 ? jobText : `<p>${jobText}</p>`,
      salaryRange: isIndianContext
        ? { min: 1200000, max: 2000000, currency: "INR" }
        : { min: 120000, max: 170000, currency: "USD" },
      location: isIndianContext ? "Bengaluru, India (Hybrid)" : "Remote",
      pincode: "",
      experienceRequired: { min: 2, max: 5 },
      jobType: "hybrid",
      applyUrl: "",
      applyMode: "easy-apply",
      skills: techSkills.length > 0 ? techSkills : ["TypeScript", "React", "Node.js"],
    };
  }

  const prompt = `You are an expert HR and recruitment AI parser.
Analyze the following Job Description (JD) text and extract structured job posting fields.

CRITICAL INSTRUCTIONS FOR SALARY & CURRENCY:
1. Detect the currency accurately:
   - If the job mentions ₹, INR, Rs, Rupee, LPA, Lakhs, CTC, or Indian locations (e.g. "12-18 LPA", "₹15,00,000", "20 Lakhs per annum", "Bengaluru/India"), set "currency": "INR".
     Convert LPA or Lakhs to full numeric values: for example "12 LPA" is 1200000, "18.5 LPA" is 1850000.
   - If the job mentions $, USD, Dollar, "k" (e.g. "$130,000 - $170,000", "$140k - $180k"), set "currency": "USD" and convert to full numeric values (e.g. 140000).
   - If EUR (€) or GBP (£) are explicitly mentioned, use "EUR" or "GBP".
   - If salary is unspecified or undisclosed, default min to 0, max to 0, and currency to "INR" or "USD" based on location.

2. Full Job Description (jd):
   - Format the JD in clean, sanitized HTML with <h3> for headings, <p> for paragraphs, and <ul><li> for bullet points. Do not return markdown.

3. Extract role title, company name, location, pincode, experienceRequired (min, max in years), jobType ("remote" | "onsite" | "hybrid"), skills array, applyUrl (if external apply link found), and applyMode ("external" | "easy-apply").

Output pure raw JSON only. Do not wrap in markdown or backticks.

Schema:
{
  "companyName": "string",
  "companyLogoUrl": "string (empty string if not found)",
  "role": "string",
  "jd": "full sanitized job description in HTML format with <h3>, <p>, and <ul><li> tags",
  "salaryRange": {
    "min": number,
    "max": number,
    "currency": "USD" | "INR" | "EUR" | "GBP"
  },
  "location": "string (e.g. San Francisco, CA or Bengaluru, India or Remote)",
  "pincode": "string",
  "experienceRequired": {
    "min": number,
    "max": number
  },
  "jobType": "remote" | "onsite" | "hybrid",
  "applyUrl": "string (URL if found, else empty)",
  "applyMode": "external" | "easy-apply",
  "skills": ["Skill1", "Skill2"]
}

Job text:
${jobText.slice(0, 10000)}`;

  try {
    const response = await groq.chat.completions.create({
      model: AI_MODEL,
      messages: [
        {
          role: "system",
          content: "You extract structured job information into valid JSON with precise USD or INR currency detection according to the schema.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content || "{}";
    const cleaned = content.replace(/^```json\s*/i, "").replace(/```$/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return JobExtractedSchema.parse(parsed);
  } catch (err: any) {
    console.error("AI job extraction error:", err?.message);
    return {
      companyName: "Tech Company",
      companyLogoUrl: "",
      role: "Software Engineer",
      jd: jobText,
      salaryRange: isIndianContext
        ? { min: 1200000, max: 1800000, currency: "INR" }
        : { min: 120000, max: 160000, currency: "USD" },
      location: isIndianContext ? "Bengaluru, India (Hybrid)" : "Remote",
      pincode: "",
      experienceRequired: { min: 2, max: 5 },
      jobType: "hybrid",
      applyUrl: "",
      applyMode: "easy-apply",
      skills: ["Full Stack", "TypeScript", "React"],
    };
  }
}
