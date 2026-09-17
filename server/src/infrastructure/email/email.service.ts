import { getTransporter } from "./email.client.js";
import type { SendEmailOptions } from "./email.types.js";
import { env } from "../../config/env.js";

export async function sendEmail({
  to,
  subject,
  text,
  html,
}: SendEmailOptions): Promise<void> {
  const transporter = getTransporter();
  const from = env.EMAIL_FROM || process.env.EMAIL_FROM || "no-reply@lumeo.com";

  if (!transporter) {
    console.warn(
      `[Email Service] SMTP is not configured. Email to "${to}" with subject "${subject}" was skipped.`
    );
    return;
  }

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    console.error(`[Email Service] Failed to send email to "${to}":`, error);
  }
}
