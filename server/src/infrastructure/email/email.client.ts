import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

const smtpPort = env.SMTP_PORT || Number(process.env.SMTP_PORT) || 587;
const smtpPassword = env.SMTP_PASSWORD || process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

export function getTransporter() {
  const host = env.SMTP_HOST || process.env.SMTP_HOST;
  const user = env.SMTP_USER || process.env.SMTP_USER;

  if (!host || !user || !smtpPassword) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user,
      pass: smtpPassword,
    },
  });
}
