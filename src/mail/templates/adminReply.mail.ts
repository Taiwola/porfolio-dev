export const adminReplyMail = (recipientName: string, replyBody: string, originalSubject: string) => ({
  subject: `Re: ${originalSubject}`,
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
          <p>Hi ${recipientName},</p>
          <p>${replyBody.replace(/\n/g, '<br/>')}</p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
          <div style="background:#f1f5f9;border-left:3px solid #2ed8fa;padding:12px 16px;border-radius:4px;font-size:13px;color:#64748b;">
            <strong>Original subject:</strong> ${originalSubject}
          </div>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center;">
          You're receiving this because you contacted DevPortfolio.
        </div>
      </div>
    </body>
    </html>
  `,
});