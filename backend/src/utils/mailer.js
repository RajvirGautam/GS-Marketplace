import sgMail from '@sendgrid/mail';

// ─── Setup SendGrid ──────────────────────────────────────────────────────────
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

/**
 * Fire-and-forget email sender.
 * Never throws — a mail failure will never crash the main request flow.
 *
 * @param {{ to: string, subject: string, html: string }} options
 */
export async function sendMail({ to, subject, html }) {
    if (!process.env.SENDGRID_API_KEY || !process.env.SENDGRID_FROM_EMAIL) {
        console.warn('[mailer] SENDGRID_API_KEY or SENDGRID_FROM_EMAIL not set — skipping email send.');
        return;
    }

    try {
        const msg = {
            to,
            from: `"GS Marketplace" <${process.env.SENDGRID_FROM_EMAIL}>`,
            subject,
            html,
        };
        await sgMail.send(msg);
        console.log(`[mailer] Email sent to ${to} via SendGrid`);
    } catch (err) {
        console.error(`[mailer] Failed to send email to ${to}:`, err.response ? err.response.body : err.message);
    }
}
