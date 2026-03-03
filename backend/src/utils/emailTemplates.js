// ─── Email Templates — GS Marketplace ────────────────────────────────────────
// Dark glassmorphic brand theme: deep space gradient, indigo/violet accents 
// REDESIGNED to align with the Main App Theme (Cyan #00D9FF & Purple #7C3AED on #0A0A0A)

const BASE_STYLES = `
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
`;

const wrapper = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>GS Marketplace</title>
</head>
<body style="${BASE_STYLES}">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Card (containing Header, Content, Footer) -->
          <tr>
            <td style="background-color: #0A0A0A; background-image: linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px); background-size: 20px 20px; background-position: center center; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 40px;">
              
              <!-- Header / Logo -->
              <div style="text-align: center; margin-bottom: 32px;">
                <div style="display: inline-block; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 24px;">
                  <span style="font-size: 20px; font-weight: 800; letter-spacing: 2px; background: linear-gradient(90deg, #00D9FF, #7C3AED); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; color: #00D9FF;">
                    GS MARKETPLACE
                  </span>
                </div>
              </div>

              ${content}

              <!-- Footer -->
              <div style="margin-top: 36px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
                <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 0 0 6px 0;">
                  GS Marketplace — GSFC University's Student Marketplace
                </p>
                <p style="color: rgba(255,255,255,0.2); font-size: 11px; margin: 0;">
                  This is an automated notification. Please do not reply to this email.
                </p>
              </div>

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
export function newOfferTemplate({ sellerName, buyerName, productTitle, offerPrice, originalPrice, message, dashboardUrl }) {
  const discount = originalPrice - offerPrice;
  const pct = originalPrice > 0 ? Math.round((discount / originalPrice) * 100) : 0;

  const messageRow = message
    ? `<tr>
             <td style="padding: 0 0 24px 0;">
               <div style="background: rgba(255,255,255,0.03); border-left: 3px solid #7C3AED; border-radius: 0 8px 8px 0; padding: 14px 18px;">
                 <p style="color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">Buyer's Message</p>
                 <p style="color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; font-style: italic;">"${message}"</p>
               </div>
             </td>
           </tr>`
    : '';

  const content = `
      <!-- Badge -->
      <tr>
        <td style="padding: 0 0 24px 0;">
          <div style="display: inline-block; background: rgba(0, 217, 255, 0.1); border: 1px solid rgba(0, 217, 255, 0.25); border-radius: 8px; padding: 6px 14px;">
            <span style="color: #00D9FF; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">📨 New Offer Received</span>
          </div>
        </td>
      </tr>

      <!-- Greeting -->
      <tr>
        <td style="padding: 0 0 8px 0;">
          <h1 style="color: #ffffff; font-size: 26px; font-weight: 700; margin: 0; line-height: 1.3;">
            Hey ${sellerName}! 👋
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 0 28px 0;">
          <p style="color: rgba(255,255,255,0.6); font-size: 16px; margin: 0; line-height: 1.6;">
            <strong style="color: #00D9FF;">${buyerName}</strong> has made an offer on your listing.
          </p>
        </td>
      </tr>

      <!-- Product Info Card -->
      <tr>
        <td style="padding: 0 0 24px 0;">
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;">
            <p style="color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 8px 0;">Product</p>
            <p style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 20px 0;">${productTitle}</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding-right: 8px;">
                  <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; text-align: center;">
                    <p style="color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">Your Price</p>
                    <p style="color: rgba(255,255,255,0.5); font-size: 20px; font-weight: 700; margin: 0; text-decoration: line-through;">₹${originalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </td>
                <td width="50%" style="padding-left: 8px;">
                  <div style="background: linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(124, 58, 237, 0.1)); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
                    <p style="color: #00D9FF; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">Offer Price</p>
                    <p style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0;">₹${offerPrice.toLocaleString('en-IN')}</p>
                    ${pct > 0 ? `<p style="color: #7C3AED; font-size: 11px; font-weight: 700; margin: 4px 0 0 0;">${pct}% below your price</p>` : ''}
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
          <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #00D9FF, #7C3AED); color: #0A0A0A; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 12px; letter-spacing: 0.5px; box-shadow: 0 4px 24px rgba(0,217,255,0.3);">
            View Offer in Dashboard →
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding: 16px 0 0 0; text-align: center;">
          <p style="color: rgba(255,255,255,0.3); font-size: 12px; margin: 0;">
            Log in to accept, reject, or counter the offer. Offers expire after 7 days.
          </p>
        </td>
      </tr>
    `;

  return wrapper(`<table width="100%" cellpadding="0" cellspacing="0">${content}</table>`);
}

// ─── Template 2: Offer Accepted — Deal Done (to Buyer) ───────────────────────
export function offerAcceptedTemplate({ buyerName, sellerName, productTitle, agreedPrice, originalPrice, dashboardUrl }) {
  const savings = originalPrice - agreedPrice;
  const pct = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  const content = `
      <!-- Badge -->
      <tr>
        <td style="padding: 0 0 24px 0;">
          <div style="display: inline-block; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 8px; padding: 6px 14px;">
            <span style="color: #10B981; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;">✓ Deal Confirmed</span>
          </div>
        </td>
      </tr>

      <!-- Hero Text -->
      <tr>
        <td style="padding: 0 0 8px 0;">
          <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; line-height: 1.3;">
            Your Offer Was Accepted! 🎉
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 0 0 28px 0;">
          <p style="color: rgba(255,255,255,0.6); font-size: 16px; margin: 0; line-height: 1.6;">
            Great news, <strong style="color: #00D9FF;">${buyerName}</strong>! 
            <strong style="color: #00D9FF;">${sellerName}</strong> has accepted your offer. Coordinate with the seller to complete the handover.
          </p>
        </td>
      </tr>

      <!-- Deal Summary Card -->
      <tr>
        <td style="padding: 0 0 28px 0;">
          <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px;">
            <p style="color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin: 0 0 8px 0;">Deal Summary</p>
            <p style="color: #ffffff; font-size: 20px; font-weight: 700; margin: 0 0 20px 0;">${productTitle}</p>

            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="padding-right: 8px;">
                  <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 16px; text-align: center;">
                    <p style="color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">Original Price</p>
                    <p style="color: rgba(255,255,255,0.5); font-size: 20px; font-weight: 700; margin: 0; text-decoration: line-through;">₹${originalPrice.toLocaleString('en-IN')}</p>
                  </div>
                </td>
                <td width="50%" style="padding-left: 8px;">
                  <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05)); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
                    <p style="color: #10B981; font-size: 11px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 6px 0;">Agreed Price 🤝</p>
                    <p style="color: #34D399; font-size: 24px; font-weight: 800; margin: 0;">₹${agreedPrice.toLocaleString('en-IN')}</p>
                    ${savings > 0 ? `<p style="color: #10B981; font-size: 11px; font-weight: 700; margin: 4px 0 0 0;">You saved ₹${savings.toLocaleString('en-IN')} (${pct}% off!)</p>` : ''}
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
          <div style="background: rgba(0,217,255,0.03); border: 1px solid rgba(0,217,255,0.15); border-radius: 12px; padding: 20px 24px;">
            <p style="color: #00D9FF; font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 12px 0;">What's Next?</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr><td style="padding: 4px 0;"><span style="color: #00D9FF; font-size: 14px; margin-right: 8px;">01.</span><span style="color: rgba(255,255,255,0.8); font-size: 14px;">Open your chat with ${sellerName} to coordinate pickup/delivery.</span></td></tr>
              <tr><td style="padding: 4px 0;"><span style="color: #00D9FF; font-size: 14px; margin-right: 8px;">02.</span><span style="color: rgba(255,255,255,0.8); font-size: 14px;">Inspect the item and complete the exchange.</span></td></tr>
              <tr><td style="padding: 4px 0;"><span style="color: #00D9FF; font-size: 14px; margin-right: 8px;">03.</span><span style="color: rgba(255,255,255,0.8); font-size: 14px;">Mark the deal as ✓ Received in My Deals and leave a review!</span></td></tr>
            </table>
          </div>
        </td>
      </tr>

      <!-- CTA Button -->
      <tr>
        <td style="padding: 0; text-align: center;">
          <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #10B981, #059669); color: #000000; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 12px; letter-spacing: 0.5px; box-shadow: 0 4px 24px rgba(16,185,129,0.3);">
            View My Deals →
          </a>
        </td>
      </tr>
    `;

  return wrapper(`<table width="100%" cellpadding="0" cellspacing="0">${content}</table>`);
}
