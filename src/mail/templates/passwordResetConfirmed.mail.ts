export const passwordResetConfirmedMail = (username: string) => ({
  subject: 'Password Successfully Reset',
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
          <div style="display:inline-block;padding:8px 16px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;color:#16a34a;font-weight:700;font-size:13px;margin-bottom:16px;">
            ✓ Password Successfully Reset
          </div>
          <p>Hi ${username},</p>
          <p>Your admin password has been successfully updated. You can now log in with your new credentials.</p>
          <p style="font-size:12px;color:#94a3b8;">
            If you did not make this change, please secure your account immediately.
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