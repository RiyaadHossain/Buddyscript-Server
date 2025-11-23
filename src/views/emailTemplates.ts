export function resetPasswordTemplate(resetUrl: string) {
  return `
    <h2>Password Reset Request</h2>
    <p>You asked to reset your password. Click the link below:</p>
    <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
      Reset Password
    </a>
    <p>The token will be expired after 1 hour</p>
    <p>If you didn’t request this, ignore this email.</p>
  `;
}
