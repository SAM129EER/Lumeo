import nodemailer from "nodemailer";

const smtpPort = Number(process.env.SMTP_PORT);
const smtpPassword = process.env.SMTP_PASSWORD ?? process.env.SMTP_PASS;

if (!process.env.SMTP_HOST) {
  throw new Error("SMTP_HOST is not configured");
}

if (!process.env.SMTP_USER) {
  throw new Error("SMTP_USER is not configured");
}

if (!smtpPassword) {
  throw new Error("SMTP_PASSWORD is not configured");
}

if (!process.env.EMAIL_FROM) {
  throw new Error("EMAIL_FROM is not configured");
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: smtpPassword,
  },
});

export default transporter;
