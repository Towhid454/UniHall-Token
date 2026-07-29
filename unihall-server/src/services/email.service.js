const { Resend } = require("resend");

let resendClient;
const getResendClient = () => {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  resendClient = new Resend(apiKey);
  return resendClient;
};

const sendEmail = async ({ to, subject, text }) => {
  const from = process.env.MAIL_FROM || "UniHall <onboarding@resend.dev>";
  const client = getResendClient();

  if (!client) {
    console.warn(
      "RESEND_API_KEY is not set. Email was not sent. Set RESEND_API_KEY and MAIL_FROM in .env.",
    );
    console.log("\n📧 ───────────── EMAIL PREVIEW (not sent) ─────────────");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`\n${text}\n`);
    console.log("────────────────────────────────────────────────────────\n");
    return;
  }

  try {
    const { data, error } = await client.emails.send({
      from,
      to,
      subject,
      text,
    });

    if (error) {
      throw new Error(error.message || "Unknown Resend error");
    }

    console.log(`✅ Email sent via Resend (id: ${data?.id}) to ${to}`);
  } catch (err) {
    console.error("❌ Failed to send email via Resend:", err.message);
    console.log("\n📧 ───────────── EMAIL PREVIEW (send failed) ─────────────");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`\n${text}\n`);
    console.log("────────────────────────────────────────────────────────\n");
    // Don't re-throw — let the request complete even if email fails
  }
};

const sendVerificationEmail = async (email, name, verifyUrl) => {
  await sendEmail({
    to: email,
    subject: "Verify your UniHall account",
    text: `Hi ${name},

Please verify your email address by opening this link:
${verifyUrl}

This link expires in 24 hours. If you didn't create a UniHall account, you can ignore this email.

— UniHall`,
  });
};

const sendPasswordResetEmail = async (email, name, resetUrl) => {
  await sendEmail({
    to: email,
    subject: "Reset your UniHall password",
    text: `Hi ${name},

You (or someone else) requested a password reset. Open this link to set a new password:
${resetUrl}

This link expires in 30 minutes. If you didn't request this, you can safely ignore this email — your password will stay unchanged.

— UniHall`,
  });
};

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail };