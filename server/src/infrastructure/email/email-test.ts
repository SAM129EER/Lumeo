import "dotenv/config";

import { sendEmail } from "./email.service.js";

async function main() {
  const recipient = process.env.SMTP_USER;

  if (!recipient) {
    throw new Error("SMTP_USER is not configured");
  }

  await sendEmail({
    to: recipient,
    subject: "Lumeo email test",
    text: "Email infrastructure is working.",
    html: "<h1>Lumeo</h1><p>Email infrastructure is working.</p>",
  });

  console.log("Test email sent successfully.");
}

main().catch((error) => {
  console.error("Failed to send test email:", error);
  process.exit(1);
});