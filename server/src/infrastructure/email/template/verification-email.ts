export function createVerificationEmail(input: {
  verificationUrl: string;
}) {
  const { verificationUrl } = input;

  return {
    subject: "Verify your Lumeo email",
    text: `Verify your Lumeo email by visiting: ${verificationUrl}`,
    html: `
      <h1>Welcome to Lumeo</h1>

      <p>Thanks for creating your account.</p>

      <p>Please verify your email address by clicking the link below:</p>

      <p>
        <a href="${verificationUrl}">
          Verify your email
        </a>
      </p>

      <p>This link will expire in 15 minutes.</p>
    `,
  };
}