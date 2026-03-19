// Vercel Serverless Function — /api/contact
// Sends contact form emails via Resend (resend.com)
// Required env vars on Vercel: RESEND_API_KEY, CONTACT_EMAIL

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, subject, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' })
  }

  const resendKey = process.env.RESEND_API_KEY
  const contactEmail = process.env.CONTACT_EMAIL

  if (!resendKey || !contactEmail) {
    return res.status(500).json({ error: 'Email service not configured.' })
  }

  const emailHtml = `
    <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0d1117; color: #e2e8f0; padding: 32px; border-radius: 12px;">
      <div style="background: linear-gradient(135deg, #7c3aed, #6366f1); padding: 20px 24px; border-radius: 10px; margin-bottom: 24px;">
        <h1 style="margin: 0; font-size: 22px; color: #fff;">📬 New Portfolio Contact</h1>
        <p style="margin: 6px 0 0; color: rgba(255,255,255,0.7); font-size: 13px;">Someone reached out via your portfolio site</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 12px; width: 100px;">FROM</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 12px;">EMAIL</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08);"><a href="mailto:${email}" style="color: #a78bfa; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: #94a3b8; font-size: 12px;">SUBJECT</td>
          <td style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.08);">${subject || '(No subject)'}</td>
        </tr>
      </table>

      <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 20px;">
        <div style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">MESSAGE</div>
        <p style="margin: 0; line-height: 1.7; white-space: pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>

      <p style="margin-top: 24px; font-size: 11px; color: #4b5563; text-align: center;">
        Sent from <strong style="color: #7c3aed;">Arnab Bot Portfolio</strong> · Reply directly to ${email}
      </p>
    </div>
  `

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Arnab Portfolio <onboarding@resend.dev>',
        to: [contactEmail],
        reply_to: email,
        subject: `[Portfolio] ${subject || 'New message'} — from ${name}`,
        html: emailHtml,
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.message || 'Email failed to send')
    }

    return res.status(200).json({ success: true, message: 'Message sent successfully!' })
  } catch (err) {
    console.error('Contact form error:', err)
    return res.status(500).json({ error: err.message || 'Failed to send email.' })
  }
}
