const nodemailer = require('nodemailer');

// Gmail SMTP ট্রান্সপোর্টার তৈরি করুন
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,      // smtp.gmail.com
  port: Number(process.env.SMTP_PORT), // 587
  secure: false,                    // TLS
  auth: {
    user: process.env.SMTP_USER,    // your_email@gmail.com
    pass: process.env.SMTP_PASS,    // 16-digit App Password
  },
});

// সাধারণ ইমেইল পাঠানোর ফাংশন (যেকোনো টেমপ্লেটের জন্য)
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"UniHall" <${process.env.SMTP_USER}>`, // 'from' হিসেবে SMTP_USER বসবে
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to} (Message ID: ${info.messageId})`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    // ইমেইল ফেইল করলেও আমরা থ্রো করব না, বরং লগ করে দেব
    // যাতে সাইনআপ প্রক্রিয়া থেমে না যায়
    console.log("\n📧 ───────────── EMAIL PREVIEW (sending failed) ─────────────");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`\n${text || html}\n`);
    console.log("──────────────────────────────────────────────────────────────\n");
    // throw error; // প্রয়োজনে আনকমেন্ট করে দিতে পারেন
  }
};

// ভেরিফিকেশন ইমেইল
const sendVerificationEmail = async (email, name, verifyUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: 700; color: #0d9488;">UniHall</span>
      </div>
      <h2 style="color: #0f172a;">Welcome to UniHall, ${name}! 🎉</h2>
      <p style="color: #475569; font-size: 16px;">Please verify your email address to activate your account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" 
           style="background-color: #0d9488; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px;">Or copy this link into your browser:</p>
      <p style="color: #3b82f6; font-size: 14px; word-break: break-all;">${verifyUrl}</p>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">This link expires in <strong>24 hours</strong>.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">If you didn't create this account, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Verify your UniHall account",
    text: `Hi ${name},\n\nPlease verify your email address by opening this link:\n${verifyUrl}\n\nThis link expires in 24 hours. If you didn't create a UniHall account, you can ignore this email.\n\n— UniHall`,
    html,
  });
};

// পাসওয়ার্ড রিসেট ইমেইল
const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: 700; color: #0d9488;">UniHall</span>
      </div>
      <h2 style="color: #0f172a;">Reset Your Password, ${name}</h2>
      <p style="color: #475569; font-size: 16px;">You (or someone else) requested a password reset.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" 
           style="background-color: #0d9488; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px;">Or copy this link into your browser:</p>
      <p style="color: #3b82f6; font-size: 14px; word-break: break-all;">${resetUrl}</p>
      <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">This link expires in <strong>30 minutes</strong>.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="color: #94a3b8; font-size: 12px; text-align: center;">If you didn't request this, ignore this email — your password will remain unchanged.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Reset your UniHall password",
    text: `Hi ${name},\n\nYou (or someone else) requested a password reset. Open this link to set a new password:\n${resetUrl}\n\nThis link expires in 30 minutes. If you didn't request this, you can safely ignore this email — your password will stay unchanged.\n\n— UniHall`,
    html,
  });
};

module.exports = { sendEmail, sendVerificationEmail, sendPasswordResetEmail };