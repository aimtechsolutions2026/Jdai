export interface AtsResumeProfile {
  name?: string;
  email?: string;
  phone?: string;
  headline?: string;
  summary?: string;
  location?: string;
  skills?: string[];
  experience?: {
    company?: string;
    title?: string;
    from?: string;
    to?: string;
    description?: string;
  }[];
  education?: {
    school?: string;
    degree?: string;
    year?: string;
  }[];
  certificates?: {
    name?: string;
    issuer?: string;
    certificateId?: string;
    date?: string;
    url?: string;
  }[];
  achievements?: string[];
  projects?: {
    name?: string;
    description?: string;
    techStack?: string;
    url?: string;
  }[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  languages?: string[];
  salaryExpectation?: {
    min?: number;
    max?: number;
    currency?: string;
  };
}

export function printOrDownloadAtsResume(profile: AtsResumeProfile) {
  if (typeof window === "undefined") return;

  const candidateName = profile.name || "Candidate";
  const candidateEmail = profile.email || "";
  const candidatePhone = profile.phone || "";
  const candidateLocation = profile.location || "";
  const candidateHeadline = profile.headline || "";
  const candidateSummary = profile.summary || "";
  const candidateSkills = profile.skills || [];
  const candidateExperience = profile.experience || [];
  const candidateEducation = profile.education || [];
  const candidateCertificates = profile.certificates || [];
  const candidateProjects = profile.projects || [];
  const candidateAchievements = profile.achievements || [];
  const candidateSocialLinks = profile.socialLinks || {};

  // Build contact row items
  const contactParts: string[] = [];
  if (candidateEmail) contactParts.push(`<span>${candidateEmail}</span>`);
  if (candidatePhone) contactParts.push(`<span>${candidatePhone}</span>`);
  if (candidateLocation) contactParts.push(`<span>${candidateLocation}</span>`);
  if (candidateSocialLinks.linkedin) {
    contactParts.push(`<a href="${candidateSocialLinks.linkedin}" target="_blank" style="color:#004085;text-decoration:none;">LinkedIn</a>`);
  }
  if (candidateSocialLinks.github) {
    contactParts.push(`<a href="${candidateSocialLinks.github}" target="_blank" style="color:#004085;text-decoration:none;">GitHub</a>`);
  }
  if (candidateSocialLinks.portfolio) {
    contactParts.push(`<a href="${candidateSocialLinks.portfolio}" target="_blank" style="color:#004085;text-decoration:none;">Portfolio</a>`);
  }

  // Build experience section
  let experienceHtml = "";
  if (candidateExperience.length > 0) {
    experienceHtml = `
      <section style="margin-bottom: 14px;">
        <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #111; padding-bottom: 2px; margin: 0 0 6px 0; color: #111;">Work Experience</h2>
        ${candidateExperience
          .map(
            (exp) => `
          <div style="margin-bottom: 10px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-size: 11.5px; font-weight: 700; color: #111;">${exp.title || "Role"}</span>
              <span style="font-size: 10.5px; color: #555;">${exp.from || ""} &ndash; ${exp.to || "Present"}</span>
            </div>
            <div style="font-size: 11px; font-weight: 600; color: #333; margin-bottom: 3px;">${exp.company || ""}</div>
            ${
              exp.description
                ? `<div style="font-size: 10.5px; line-height: 1.45; color: #222; white-space: pre-line;">${exp.description}</div>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </section>
    `;
  }

  // Build education section
  let educationHtml = "";
  if (candidateEducation.length > 0) {
    educationHtml = `
      <section style="margin-bottom: 14px;">
        <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #111; padding-bottom: 2px; margin: 0 0 6px 0; color: #111;">Education</h2>
        ${candidateEducation
          .map(
            (edu) => `
          <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: baseline;">
            <div>
              <span style="font-size: 11px; font-weight: 700; color: #111;">${edu.degree || "Degree"}</span>
              <span style="font-size: 11px; color: #444;"> &mdash; ${edu.school || "Institution"}</span>
            </div>
            <span style="font-size: 10.5px; color: #555;">${edu.year || ""}</span>
          </div>
        `
          )
          .join("")}
      </section>
    `;
  }

  // Build skills section
  let skillsHtml = "";
  if (candidateSkills.length > 0) {
    skillsHtml = `
      <section style="margin-bottom: 14px;">
        <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #111; padding-bottom: 2px; margin: 0 0 6px 0; color: #111;">Key Skills</h2>
        <p style="font-size: 10.5px; line-height: 1.5; color: #222; margin: 0;">
          ${candidateSkills.join(" &bull; ")}
        </p>
      </section>
    `;
  }

  // Build projects section
  let projectsHtml = "";
  if (candidateProjects.length > 0) {
    projectsHtml = `
      <section style="margin-bottom: 14px;">
        <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #111; padding-bottom: 2px; margin: 0 0 6px 0; color: #111;">Projects</h2>
        ${candidateProjects
          .map(
            (p) => `
          <div style="margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span style="font-size: 11px; font-weight: 700; color: #111;">${p.name || "Project"}</span>
              ${
                p.url
                  ? `<a href="${p.url}" target="_blank" style="font-size: 10px; color: #004085; text-decoration: none;">View Project &rarr;</a>`
                  : ""
              }
            </div>
            ${
              p.techStack
                ? `<div style="font-size: 10px; color: #555; margin-bottom: 2px;">Technologies: ${p.techStack}</div>`
                : ""
            }
            ${
              p.description
                ? `<div style="font-size: 10.5px; line-height: 1.4; color: #222;">${p.description}</div>`
                : ""
            }
          </div>
        `
          )
          .join("")}
      </section>
    `;
  }

  // Build certificates section
  let certificatesHtml = "";
  if (candidateCertificates.length > 0) {
    certificatesHtml = `
      <section style="margin-bottom: 14px;">
        <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #111; padding-bottom: 2px; margin: 0 0 6px 0; color: #111;">Certifications</h2>
        ${candidateCertificates
          .map(
            (cert) => `
          <div style="margin-bottom: 4px; display: flex; justify-content: space-between; align-items: baseline;">
            <div>
              <span style="font-size: 10.5px; font-weight: 700; color: #111;">${cert.name}</span>
              ${cert.issuer ? `<span style="font-size: 10.5px; color: #444;"> &mdash; ${cert.issuer}</span>` : ""}
            </div>
            <span style="font-size: 10px; color: #555;">${cert.date || ""}</span>
          </div>
        `
          )
          .join("")}
      </section>
    `;
  }

  // Build achievements section
  let achievementsHtml = "";
  if (candidateAchievements.length > 0) {
    achievementsHtml = `
      <section style="margin-bottom: 14px;">
        <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #111; padding-bottom: 2px; margin: 0 0 6px 0; color: #111;">Achievements &amp; Honors</h2>
        <ul style="margin: 0; padding-left: 16px; font-size: 10.5px; line-height: 1.45; color: #222;">
          ${candidateAchievements.map((item) => `<li style="margin-bottom: 3px;">${item}</li>`).join("")}
        </ul>
      </section>
    `;
  }

  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${candidateName} - ATS Resume</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 14mm 12mm 14mm;
    }
    @media print {
      body {
        margin: 0;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111;
      background: #fff;
      font-size: 11px;
      line-height: 1.45;
      margin: 0 auto;
      padding: 16px 20px;
      box-sizing: border-box;
      max-width: 800px;
    }
    a { color: #004085; text-decoration: none; }
  </style>
</head>
<body>
  <!-- Header -->
  <header style="text-align: center; margin-bottom: 14px; border-bottom: 2px solid #111; padding-bottom: 10px;">
    <h1 style="font-size: 20px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; margin: 0 0 4px 0; color: #111;">
      ${candidateName}
    </h1>
    ${
      candidateHeadline
        ? `<div style="font-size: 12px; font-weight: 600; color: #444; margin-bottom: 5px;">${candidateHeadline}</div>`
        : ""
    }
    <div style="font-size: 10px; color: #444; display: flex; flex-wrap: wrap; justify-content: center; gap: 8px;">
      ${contactParts.join(" &bull; ")}
    </div>
  </header>

  <!-- Summary -->
  ${
    candidateSummary
      ? `
    <section style="margin-bottom: 14px;">
      <h2 style="font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #111; padding-bottom: 2px; margin: 0 0 6px 0; color: #111;">Professional Summary</h2>
      <p style="font-size: 10.5px; line-height: 1.5; color: #222; margin: 0; text-align: justify;">
        ${candidateSummary}
      </p>
    </section>
  `
      : ""
  }

  ${skillsHtml}
  ${experienceHtml}
  ${educationHtml}
  ${projectsHtml}
  ${certificatesHtml}
  ${achievementsHtml}
</body>
</html>`;

  // Use a hidden iframe for seamless print dialog
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.setAttribute("aria-hidden", "true");

  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    // Fallback: open print in new tab
    const printWin = window.open("", "_blank");
    if (printWin) {
      printWin.document.write(fullHtml);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
      }, 250);
    }
    return;
  }

  doc.open();
  doc.write(fullHtml);
  doc.close();

  // Wait briefly for CSS/rendering, then trigger print dialog
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  }, 250);
}

