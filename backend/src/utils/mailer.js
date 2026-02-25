import nodemailer from 'nodemailer';

// ─── Transporter ─────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PWD,
    },
});

/**
 * Fire-and-forget email sender.
 * Never throws — a mail failure will never crash the main request flow.
 *
 * @param {{ to: string, subject: string, html: string }} options
 */
export async function sendMail({ to, subject, html }) {
    if (!process.env.MAIL_USER || !process.env.MAIL_PWD) {
        console.warn('[mailer] MAIL_USER or MAIL_PWD not set — skipping email send.');
        return;
    }

    try {
        const info = await transporter.sendMail({
            from: `"GS Marketplace" <${process.env.MAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`[mailer] Email sent to ${to} → ${info.messageId}`);
    } catch (err) {
        console.error(`[mailer] Failed to send email to ${to}:`, err.message);
    }
}
