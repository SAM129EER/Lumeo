import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const smtpPass = env.SMTP_PASSWORD || env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth:
    env.SMTP_USER && smtpPass
      ? {
          user: env.SMTP_USER,
          pass: smtpPass,
        }
      : undefined,
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!env.SMTP_USER || !smtpPass) {
    console.warn(`[Email] SMTP not configured. Skipped sending email to ${to} ("${subject}")`);
    return;
  }

  await transporter.sendMail({
    from: env.EMAIL_FROM || env.SMTP_USER,
    to,
    subject,
    html,
  });
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Verify your email address",
    html: `
      <h2>Welcome to Lumeo</h2>
      <p>Please click the button below to verify your email address:</p>
      <p>
        <a href="${verifyUrl}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
      </p>
      <p>Or paste this link into your browser: <br/><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>This link will expire in 24 hours.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;

  await sendEmail({
    to: email,
    subject: "Reset your password",
    html: `
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Click the link below to set a new password:</p>
      <p>
        <a href="${resetUrl}" style="background-color: #EF4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p>Or paste this link into your browser: <br/><a href="${resetUrl}">${resetUrl}</a></p>
      <p>This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}
