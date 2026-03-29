export const forgotPasswordMail = (username: string, resetUrl: string) => ({
  subject: 'Password Reset Request',
  html: `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8" /></head>
    <body style="font-family:sans-serif;background:#f8fafc;margin:0;padding:0;">
      <div style="max-width:600px;margin:40px auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <div style="background:#0f1f23;padding:24px 32px;">
          <h1 style="color:#2ed8fa;font-size:20px;margin:0;">DevPortfolio</h1>
        </div>
        <div style="padding:32px;font-size:14px;line-height:1.8;color:#334155;">
          <p>Hi ${username},</p>
          <p>We received a request to reset your admin password. Click the button below to reset it:</p>
          <a href="${resetUrl}" style="display:inline-block;margin:24px 0;padding:12px 32px;background:#2ed8fa;color:#0f1f23;font-weight:700;border-radius:8px;text-decoration:none;font-size:14px;">
            Reset Password
          </a>
          <p style="font-size:12px;color:#94a3b8;">
            This link expires in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.
          </p>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
          DevPortfolio Admin · Security notification
        </div>
      </div>
    </body>
    </html>
  `,
});