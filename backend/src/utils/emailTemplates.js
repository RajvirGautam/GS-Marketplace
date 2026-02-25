// ─── Email Templates — GS Marketplace ────────────────────────────────────────
// Dark glassmorphic brand theme: deep space gradient, indigo/violet accents

const BASE_STYLES = `
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

const wrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GS Marketplace</title>
</head>
<body style="${BASE_STYLES} background: #090b1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #090b1a 0%, #12163a 50%, #0d1030 100%); min-height: 100vh; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header / Logo -->
          <tr>
            <td style="padding: 0 0 32px 0; text-align: center;">
              <div style="display: inline-block; background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1)); border: 1px solid rgba(99,102,241,0.3); border-radius: 16px; padding: 16px 32px; backdrop-filter: blur(12px);">
                <span style="font-size: 22px; font-weight: 800; letter-spacing: 2px; background: linear-gradient(90deg, #818cf8, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: white; background-clip: text;">
                  GS MARKETPLACE
                </span>
              </div>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)); border: 1px solid rgba(99,102,241,0.25); border-radius: 20px; padding: 40px; backdrop-filter: blur(20px);">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 0 0 0; text-align: center;">
              <p style="color: rgba(148,163,184,0.5); font-size: 12px; margin: 0 0 6px 0;">
                GS Marketplace — GSFC University's Student Marketplace
              </p>
              <p style="color: rgba(148,163,184,0.35); font-size: 11px; margin: 0;">
                This is an automated notification. Please do not reply to this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ─── Template 1: New Offer Received (to Seller) ───────────────────────────────
/**
 * @param {{
 *   sellerName: string,
 *   buyerName: string,
 *   productTitle: string,
 *   offerPrice: number,
 *   originalPrice: number,
 *   message?: string,
 *   dashboardUrl: string
 * }} opts
 */
export function newOfferTemplate({ sellerName, buyerName, productTitle, offerPrice, originalPrice, message, dashboardUrl }) {
  const discount = originalPrice - offerPrice;
  const pct = originalPrice > 0 ? Math.round((discount / originalPrice) * 100) : 0;

  const messageRow = message
    ? `<tr>
             <td style="padding: 0 0 24px 0;">
               <div style="background: rgba(99,102,241,0.08); border-left: 3px solid rgba(99,102,241,0.5); border-radius: 0 8px 8px 0; padding: 14px 18px;">
                 <p style="color: rgba(148,163,184,0.7); font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">Buyer's Message</p>
                 <p style="color: #e2e8f0; font-size: 14px; margin: 0; font-style: italic;">"${message}"</p>
               </div>
             </td>
           </tr>`
    : '';

  const content = `
      <!-- Badge -->
      <tr>
        <td style="padding: 0 0 24px 0;">
          <div style="display: inline-block; background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15)); border: 1px solid rgba(99,102,241,0.4); border-radius: 8px; padding: 6px 14px;">
            <span style="color: #a78bfa; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">📨 New Offer Received</span>
          </div>
        </td>
      </tr>

      <!-- Greeting -->
      <tr>
        <td style="padding: 0 0 8px 0;">
          <h1 style="color: #f1f5f9; font-size: 26px; font-weight: 700; margin: 0; line-height: 1.3;">
            Hey ${sellerName}! 👋
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 0 28px 0;">
          <p style="color: #94a3b8; font-size: 16px; margin: 0; line-height: 1.6;">
            <strong style="color: #c7d2fe;">${buyerName}</strong> has made an offer on your listing.
          </p>
        </td>
      </tr>

      <!-- Product Info Card -->
      <tr>
        <td style="padding: 0 0 24px 0;">
          <div style="background: rgba(15,18,40,0.6); border: 1px solid rgba(99,102,241,0.2); border-radius: 14px; padding: 24px;">
            <p style="color: rgba(148,163,184,0.6); font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 8px 0;">Product</p>
            <p style="color: #f1f5f9; font-size: 20px; font-weight: 700; margin: 0 0 20px 0;">${productTitle}</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding-right: 8px;">
                  <div style="background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.25); border-radius: 10px; padding: 16px; text-align: center;">
                    <p style="color: rgba(148,163,184,0.6); font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">Your Price</p>
                    <p style="color: #64748b; font-size: 20px; font-weight: 700; margin: 0; text-decoration: line-through;">₹${originalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </td>
                <td width="50%" style="padding-left: 8px;">
                  <div style="background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15)); border: 1px solid rgba(99,102,241,0.4); border-radius: 10px; padding: 16px; text-align: center;">
                    <p style="color: #a78bfa; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">Offer Price</p>
                    <p style="color: #818cf8; font-size: 24px; font-weight: 800; margin: 0;">₹${offerPrice.toLocaleString('en-IN')}</p>
                    ${pct > 0 ? `<p style="color: #f472b6; font-size: 11px; font-weight: 600; margin: 4px 0 0 0;">${pct}% below your price</p>` : ''}
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>

      <!-- Buyer Message (if any) -->
      <table width="100%" cellpadding="0" cellspacing="0">
        ${messageRow}
      </table>

      <!-- CTA Button -->
      <tr>
        <td style="padding: 8px 0 0 0; text-align: center;">
          <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 10px; letter-spacing: 0.5px; box-shadow: 0 4px 24px rgba(99,102,241,0.4);">
            View Offer in Dashboard →
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 0 0 0; text-align: center;">
          <p style="color: rgba(148,163,184,0.45); font-size: 12px; margin: 0;">
            Log in to accept, reject, or counter the offer. Offers expire after 7 days.
          </p>
        </td>
      </tr>
    `;

  return wrapper(`<table width="100%" cellpadding="0" cellspacing="0">${content}</table>`);
}

// ─── Template 2: Offer Accepted — Deal Done (to Buyer) ───────────────────────
/**
 * @param {{
 *   buyerName: string,
 *   sellerName: string,
 *   productTitle: string,
 *   agreedPrice: number,
 *   originalPrice: number,
 *   dashboardUrl: string
 * }} opts
 */
export function offerAcceptedTemplate({ buyerName, sellerName, productTitle, agreedPrice, originalPrice, dashboardUrl }) {
  const savings = originalPrice - agreedPrice;
  const pct = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  const content = `
      <!-- Badge -->
      <tr>
        <td style="padding: 0 0 24px 0;">
          <div style="display: inline-block; background: linear-gradient(135deg, rgba(16,185,129,0.2), rgba(5,150,105,0.15)); border: 1px solid rgba(16,185,129,0.4); border-radius: 8px; padding: 6px 14px;">
            <span style="color: #34d399; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">✓ Deal Confirmed</span>
          </div>
        </td>
      </tr>

      <!-- Hero Text -->
      <tr>
        <td style="padding: 0 0 8px 0;">
          <h1 style="color: #f1f5f9; font-size: 28px; font-weight: 800; margin: 0; line-height: 1.3;">
            Your Offer Was Accepted! 🎉
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 0 28px 0;">
          <p style="color: #94a3b8; font-size: 16px; margin: 0; line-height: 1.6;">
            Great news, <strong style="color: #c7d2fe;">${buyerName}</strong>! 
            <strong style="color: #c7d2fe;">${sellerName}</strong> has accepted your offer. Coordinate with the seller to complete the handover.
          </p>
        </td>
      </tr>

      <!-- Deal Summary Card -->
      <tr>
        <td style="padding: 0 0 28px 0;">
          <div style="background: rgba(15,18,40,0.6); border: 1px solid rgba(16,185,129,0.25); border-radius: 14px; padding: 24px;">
            <p style="color: rgba(148,163,184,0.6); font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 8px 0;">Deal Summary</p>
            <p style="color: #f1f5f9; font-size: 20px; font-weight: 700; margin: 0 0 20px 0;">${productTitle}</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding-right: 8px;">
                  <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 16px; text-align: center;">
                    <p style="color: rgba(148,163,184,0.6); font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">Original Price</p>
                    <p style="color: #64748b; font-size: 20px; font-weight: 700; margin: 0; text-decoration: line-through;">₹${originalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </td>
                <td width="50%" style="padding-left: 8px;">
                  <div style="background: linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1)); border: 1px solid rgba(16,185,129,0.35); border-radius: 10px; padding: 16px; text-align: center;">
                    <p style="color: #34d399; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">Agreed Price 🤝</p>
                    <p style="color: #6ee7b7; font-size: 24px; font-weight: 800; margin: 0;">₹${agreedPrice.toLocaleString('en-IN')}</p>
                    ${savings > 0 ? `<p style="color: #34d399; font-size: 11px; font-weight: 600; margin: 4px 0 0 0;">You saved ₹${savings.toLocaleString('en-IN')} (${pct}% off!)</p>` : ''}
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </td>
      </tr>

      <!-- Next Steps -->
      <tr>
        <td style="padding: 0 0 28px 0;">
          <div style="background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.15); border-radius: 12px; padding: 20px 24px;">
            <p style="color: #a78bfa; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 12px 0;">What's Next?</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding: 4px 0;"><span style="color: #818cf8; font-size: 14px; margin-right: 8px;">01.</span><span style="color: #cbd5e1; font-size: 14px;">Open your chat with ${sellerName} to coordinate pickup/delivery.</span></td></tr>
              <tr><td style="padding: 4px 0;"><span style="color: #818cf8; font-size: 14px; margin-right: 8px;">02.</span><span style="color: #cbd5e1; font-size: 14px;">Inspect the item and complete the exchange.</span></td></tr>
              <tr><td style="padding: 4px 0;"><span style="color: #818cf8; font-size: 14px; margin-right: 8px;">03.</span><span style="color: #cbd5e1; font-size: 14px;">Mark the deal as ✓ Received in My Deals and leave a review!</span></td></tr>
            </table>
          </div>
        </td>
      </tr>

      <!-- CTA Button -->
      <tr>
        <td style="padding: 0; text-align: center;">
          <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 10px; letter-spacing: 0.5px; box-shadow: 0 4px 24px rgba(16,185,129,0.35);">
            View My Deals →
          </a>
        </td>
      </tr>
    `;

  return wrapper(`<table width="100%" cellpadding="0" cellspacing="0">${content}</table>`);
}
