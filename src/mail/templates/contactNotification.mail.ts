export const contactNotificationMail = (sender: string, email: string, subject: string, body: string) => ({
  subject: `New Contact: ${subject}`,
  html: `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8" /></head>
    <body style="font-family:sans-serif;background:#0f1f23;color:#e2e8f0;margin:0;padding:0;">
      <div style="max-width:600px;margin:40px auto;background:#1a2f35;border:1px solid #2d4a52;border-radius:12px;overflow:hidden;">
        <div style="background:#0f1f23;padding:24px 32px;border-bottom:1px solid #2d4a52;">
          <h1 style="color:#2ed8fa;font-size:20px;margin:0;">New Contact Request</h1>
        </div>
        <div style="padding:32px;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">From</p>
          <p style="margin:0 0 16px;font-size:14px;">${sender}</p>
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Email</p>
          <p style="margin:0 0 16px;font-size:14px;">${email}</p>
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Subject</p>
          <p style="margin:0 0 16px;font-size:14px;">${subject}</p>
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Message</p>
          <div style="background:#0f1f23;border:1px solid #2d4a52;border-radius:8px;padding:16px;font-size:14px;line-height:1.6;color:#cbd5e1;">
            ${body.replace(/\n/g, '<br/>')}
          </div>
        </div>
        <div style="padding:16px 32px;border-top:1px solid #2d4a52;font-size:12px;color:#475569;text-align:center;">
          DevPortfolio Admin · Internal notification
        </div>
      </div>
    </body>
    </html>
  `,
});