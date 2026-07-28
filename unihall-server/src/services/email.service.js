const nodemailer = require("nodemailer");

const getSmtpConfig = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  };
};

let transporter;
const getTransporter = () => {
  if (transporter) return transporter;

  const smtpConfig = getSmtpConfig();
  if (!smtpConfig) return null;

  transporter = nodemailer.createTransport(smtpConfig);
  return transporter;
};

const sendEmail = async ({ to, subject, text }) => {
  const from = process.env.MAIL_FROM || process.env.SMTP_USER;
  const smtpTransporter = getTransporter();

  if (!smtpTransporter || !from) {
    console.warn(
      "SMTP is not fully configured. Email was not sent. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM in .env.",
    );
    console.log("\n📧 ───────────── EMAIL PREVIEW (not sent) ─────────────");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`\n${text}\n`);
    console.log("────────────────────────────────────────────────────────\n");
    return;
  }

  await smtpTransporter.sendMail({
    from,
    to,
    subject,
    text,
  });
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