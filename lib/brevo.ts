/**
 * Brevo (formerly Sendinblue) Transactional Email Service
 * Uses Brevo REST API v3 for high reliability in serverless and containerized runtimes.
 */

export interface SendEmailOptions {
  toEmail: string;
  name?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export async function sendBrevoEmail(options: SendEmailOptions): Promise<{ success: boolean; messageId?: string; simulated?: boolean; error?: string }> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const senderEmail = process.env.BREVO_SENDER_EMAIL?.trim() || "support@codifypro.com";
  const senderName = process.env.BREVO_SENDER_NAME?.trim() || "CodifyPro";

  // If no API key configured, simulate sending in development/testing
  if (!apiKey) {
    console.log("--------------------------------------------------");
    console.log("📨 [BREVO EMAIL SIMULATION (No API Key Configured)]");
    console.log(`To: ${options.toEmail} (${options.name || "User"})`);
    console.log(`From: ${senderName} <${senderEmail}>`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Content:\n${options.textContent || options.htmlContent}`);
    console.log("--------------------------------------------------");
    return { success: true, simulated: true };
  }

  try {
    const payload = {
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [
        {
          email: options.toEmail,
          name: options.name || options.toEmail.split("@")[0],
        },
      ],
      subject: options.subject,
      htmlContent: options.htmlContent,
      textContent: options.textContent,
    };

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[BREVO ERROR]", data);
      return { success: false, error: data.message || "Failed to send email via Brevo" };
    }

    return { success: true, messageId: data.messageId };
  } catch (err: any) {
    console.error("[BREVO EXCEPTION]", err);
    return { success: false, error: err.message || "Network exception while contacting Brevo API" };
  }
}

/**
 * Sends a password reset email to a user with a secure reset link.
 */
export async function sendPasswordResetEmail(
  toEmail: string,
  resetUrl: string,
  name?: string
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const recipientName = name || toEmail.split("@")[0] || "there";
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .logo { font-size: 20px; font-weight: 900; color: #2563eb; margin-bottom: 24px; }
          .heading { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
          .text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 24px; }
          .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-bottom: 24px; }
          .footer { font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; }
          .break-link { word-break: break-all; color: #2563eb; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">CodifyPro</div>
          <div class="heading">Reset your password</div>
          <p class="text">Hi ${recipientName},</p>
          <p class="text">We received a request to reset your password for your CodifyPro account. Click the button below to set a new password:</p>
          <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
          <p class="text">This link is valid for <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email — your password will remain unchanged.</p>
          <div class="footer">
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p class="break-link">${resetUrl}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
Hi ${recipientName},

We received a request to reset your password for your CodifyPro account.
Click the following link to set a new password:
${resetUrl}

This link is valid for 1 hour. If you did not request this, you can safely ignore this email.

— Team CodifyPro
  `.trim();

  return sendBrevoEmail({
    toEmail,
    name: recipientName,
    subject: "Reset your CodifyPro password",
    htmlContent,
    textContent,
  });
}

