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

/**
 * Sends an email with the newly generated password to the user.
 */
export async function sendNewPasswordEmail(
  toEmail: string,
  newPassword: string,
  loginUrl: string,
  name?: string
): Promise<{ success: boolean; simulated?: boolean; error?: string }> {
  const recipientName = name || toEmail.split("@")[0] || "there";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your New CodifyPro Login Password</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
          .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
          .logo { font-size: 20px; font-weight: 900; color: #2563eb; margin-bottom: 24px; }
          .heading { font-size: 22px; font-weight: 800; color: #0f172a; margin-bottom: 12px; }
          .text { font-size: 14px; line-height: 1.6; color: #475569; margin-bottom: 20px; }
          .code-box { background-color: #f1f5f9; border: 1px dashed #cbd5e1; padding: 16px; border-radius: 12px; font-size: 22px; font-weight: 800; font-family: monospace; letter-spacing: 2px; text-align: center; color: #2563eb; margin: 20px 0; }
          .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 10px; margin-top: 10px; margin-bottom: 24px; }
          .footer { font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">CodifyPro</div>
          <div class="heading">Your New Account Password</div>
          <p class="text">Hi ${recipientName},</p>
          <p class="text">We received a request to recover your password. Here is your new login password:</p>
          <div class="code-box">${newPassword}</div>
          <p class="text">You can now use this password to sign in immediately. For your security, you can change your password anytime after logging in.</p>
          <a href="${loginUrl}" class="btn" target="_blank">Sign In to CodifyPro</a>
          <div class="footer">
            <p>If you did not request this, please contact support or update your password immediately.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  const textContent = `
Hi ${recipientName},

We received a request to recover your password. Here is your new login password:

${newPassword}

You can use this password to sign in now at: ${loginUrl}
Once logged in, you can update your password in your settings.

— Team CodifyPro
  `.trim();

  return sendBrevoEmail({
    toEmail,
    name: recipientName,
    subject: "Your New CodifyPro Login Password",
    htmlContent,
    textContent,
  });
}

