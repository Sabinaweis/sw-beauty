import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to escape HTML to prevent XSS
export function escapeHtml(unsafe) {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Helper function to generate security hash
export function generateHash(email, amount, service = '') {
  const secret = process.env.VOUCHER_SECRET;
  if (!secret) {
    console.warn('WARNING: VOUCHER_SECRET environment variable is not set. Using insecure default.');
  }
  const secretKey = secret || 'default-secret-change-me';
  const data = `${email}-${amount}-${service}-${secretKey}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Email template for owner with confirmation link
export function ownerEmailTemplate(recipientName, recipientEmail, recipientPhone, voucherType, amount, service, packageName, message, paymentMethod, confirmUrl) {
  const safeName = escapeHtml(recipientName);
  const safeEmail = escapeHtml(recipientEmail);
  const safePhone = escapeHtml(recipientPhone);
  const safeAmount = escapeHtml(amount);
  const safeService = escapeHtml(service);
  const safePackage = escapeHtml(packageName);
  const safeMessage = escapeHtml(message);
  const safePaymentMethod = paymentMethod === 'transfer' ? 'Bankovní převod' : 'Hotově v salonu';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Cormorant Garamond', 'Georgia', serif; line-height: 1.6; color: #44403c; background: #FDFBF7; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { text-align: center; padding: 40px 30px; background: linear-gradient(to bottom, #FDFBF7, white); border-bottom: 1px solid #e7e5e4; }
          .logo { font-size: 48px; font-weight: 300; letter-spacing: -0.02em; color: #1c1917; margin: 0; font-family: 'Cormorant Garamond', serif; }
          .tagline { margin: 8px 0 0; color: #78716c; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-family: 'Helvetica Neue', Arial, sans-serif; }
          .content { padding: 40px 30px; }
          .button { display: inline-block; padding: 16px 40px; background: #1c1917; color: white !important; text-decoration: none; margin: 20px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; font-family: 'Helvetica Neue', Arial, sans-serif; transition: background 0.3s; }
          .button:hover { background: #292524; }
          .details { background: #fafaf9; padding: 24px; margin: 24px 0; border-left: 3px solid #1c1917; }
          .details-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e7e5e4; }
          .details-row:last-child { border-bottom: none; }
          .label { color: #78716c; text-transform: uppercase; font-size: 10px; letter-spacing: 0.12em; font-family: 'Helvetica Neue', Arial, sans-serif; }
          .value { font-weight: 500; font-size: 15px; color: #1c1917; }
          .footer { text-align: center; padding: 30px; background: #fafaf9; border-top: 1px solid #e7e5e4; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">SW Beauty.</h1>
            <p class="tagline">Nová objednávka poukazu</p>
          </div>
          
          <div class="content">
            <h2 style="font-size: 20px; font-weight: 400;">Dobrý den,</h2>
            <p>Přišla nová objednávka dárkového poukazu. Po přijetí platby klikněte na tlačítko níže pro odeslání poukazu klientovi.</p>
            
            <div class="details">
              <div class="details-row">
                <span class="label">Obdarovaný</span>
                <span class="value">${safeName}</span>
              </div>
              <div class="details-row">
                <span class="label">Email</span>
                <span class="value">${safeEmail}</span>
              </div>
              <div class="details-row">
                <span class="label">Typ</span>
                <span class="value">${voucherType === 'cash' ? 'Na částku' : 'Na proceduru'}</span>
              </div>
              <div class="details-row">
                <span class="label">Hodnota</span>
                <span class="value">${voucherType === 'cash' ? `${safeAmount} Kč` : `${safeService}${safePackage ? ` - ${safePackage}` : ''}`}</span>
              </div>
              ${safePhone ? `
              <div class="details-row">
                <span class="label">Telefon</span>
                <span class="value">${safePhone}</span>
              </div>
              ` : ''}
              <div class="details-row">
                <span class="label">Způsob platby</span>
                <span class="value">${safePaymentMethod}</span>
              </div>
              ${safeMessage ? `
              <div class="details-row" style="border: none; padding-top: 10px;">
                <span class="label">Věnování</span>
              </div>
              <div style="padding: 10px 0; font-style: italic; color: #57534e;">
                "${safeMessage}"
              </div>
              ` : ''}
            </div>
            
            <div style="text-align: center; padding: 20px 0;">
              <a href="${confirmUrl}" class="button">Potvrdit platbu a odeslat poukaz</a>
            </div>
            
            <p style="color: #78716c; font-size: 13px; margin-top: 30px;">
              Kliknutím na tlačítko potvrdíte přijetí platby a poukaz bude automaticky odeslán na email ${recipientEmail}.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Email template for customer with payment instructions (bank transfer)
export function customerPaymentInstructionsTemplate(recipientName, voucherType, amount, service, packageName) {
  const safeName = escapeHtml(recipientName);
  const safeAmount = escapeHtml(amount);
  const safeService = escapeHtml(service);
  const safePackage = escapeHtml(packageName);

  // Generate unique variable symbol (timestamp-based)
  const variableSymbol = Date.now().toString().slice(-8);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Cormorant Garamond', 'Georgia', serif; line-height: 1.6; color: #44403c; background: #FDFBF7; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { text-align: center; padding: 40px 30px; background: linear-gradient(to bottom, #FDFBF7, white); border-bottom: 1px solid #e7e5e4; }
          .logo { font-size: 48px; font-weight: 300; letter-spacing: -0.02em; color: #1c1917; margin: 0; font-family: 'Cormorant Garamond', serif; }
          .tagline { margin: 8px 0 0; color: #78716c; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-family: 'Helvetica Neue', Arial, sans-serif; }
          .content { padding: 40px 30px; }
          .title { font-size: 28px; font-weight: 400; color: #1c1917; margin-bottom: 20px; font-family: 'Cormorant Garamond', serif; }
          .text { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 15px; color: #57534e; line-height: 1.7; }
          .details { background: #fafaf9; padding: 24px; margin: 24px 0; border-left: 3px solid #1c1917; }
          .details-row { padding: 12px 0; border-bottom: 1px solid #e7e5e4; }
          .details-row:last-child { border-bottom: none; }
          .label { color: #78716c; text-transform: uppercase; font-size: 10px; letter-spacing: 0.12em; display: block; margin-bottom: 6px; font-family: 'Helvetica Neue', Arial, sans-serif; }
          .value { font-weight: 500; font-size: 18px; display: block; color: #1c1917; }
          .important { background: #fef3c7; padding: 20px; margin: 24px 0; border-left: 4px solid #f59e0b; }
          .footer { text-align: center; padding: 30px; background: #fafaf9; border-top: 1px solid #e7e5e4; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">SW Beauty.</h1>
            <p class="tagline">Dárkový poukaz</p>
          </div>
          
          <div class="content">
            <h2 class="title">Děkujeme za vaši objednávku!</h2>
            <p class="text">Pro dokončení objednávky dárkového poukazu pro <strong>${safeName}</strong> prosím uhraďte níže uvedenou částku.</p>
            
            <div class="details">
              <div class="details-row">
                <span class="label">Číslo účtu</span>
                <span class="value">6657095339/0800</span>
              </div>
              <div class="details-row">
                <span class="label">Variabilní symbol</span>
                <span class="value">${variableSymbol}</span>
              </div>
              <div class="details-row">
                <span class="label">Částka k úhradě</span>
                <span class="value">${voucherType === 'cash' ? `${safeAmount} Kč` : `${safeService}${safePackage ? ` - ${safePackage}` : ''}`}</span>
              </div>
            </div>
            
            <div class="important">
              <p style="margin: 0; font-size: 14px;"><strong>⏱ Důležité:</strong> Dárkový poukaz vám zašleme e-mailem po připsání platby na náš účet. Obvykle do 24 hodin.</p>
            </div>
            
            <p style="color: #78716c; font-size: 13px;">
              Pokud máte jakékoliv dotazy, neváhejte nás kontaktovat na <a href="mailto:info@swbeauty.cz" style="color: #1c1917;">info@swbeauty.cz</a> nebo na tel. +420 776 632 498.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

// Email template for customer with cash payment confirmation
export function customerCashConfirmationTemplate(recipientName, voucherType, amount, service, packageName) {
  const safeName = escapeHtml(recipientName);
  const safeAmount = escapeHtml(amount);
  const safeService = escapeHtml(service);
  const safePackage = escapeHtml(packageName);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Cormorant Garamond', 'Georgia', serif; line-height: 1.6; color: #44403c; background: #FDFBF7; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; background: white; }
          .header { text-align: center; padding: 40px 30px; background: linear-gradient(to bottom, #FDFBF7, white); border-bottom: 1px solid #e7e5e4; }
          .logo { font-size: 48px; font-weight: 300; letter-spacing: -0.02em; color: #1c1917; margin: 0; font-family: 'Cormorant Garamond', serif; }
          .tagline { margin: 8px 0 0; color: #78716c; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-family: 'Helvetica Neue', Arial, sans-serif; }
          .content { padding: 40px 30px; }
          .title { font-size: 28px; font-weight: 400; color: #1c1917; margin-bottom: 20px; font-family: 'Cormorant Garamond', serif; }
          .text { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 15px; color: #57534e; line-height: 1.7; }
          .details { background: #fafaf9; padding: 24px; margin: 24px 0; }
          .details-row { padding: 12px 0; border-bottom: 1px solid #e7e5e4; }
          .details-row:last-child { border-bottom: none; }
          .label { color: #78716c; text-transform: uppercase; font-size: 10px; letter-spacing: 0.12em; display: block; margin-bottom: 6px; font-family: 'Helvetica Neue', Arial, sans-serif; }
          .value { font-weight: 500; font-size: 18px; display: block; color: #1c1917; }
          .important { background: #dcfce7; padding: 20px; margin: 24px 0; border-left: 4px solid #16a34a; }
          .contact { background: #fafaf9; padding: 24px; margin: 24px 0; }
          .footer { text-align: center; padding: 30px; background: #fafaf9; border-top: 1px solid #e7e5e4; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">SW Beauty.</h1>
            <p class="tagline">Dárkový poukaz</p>
          </div>
          
          <div class="content">
            <h2 class="title">Děkujeme za vaši objednávku!</h2>
            <p class="text">Vaše objednávka dárkového poukazu pro <strong>${safeName}</strong> byla úspěšně přijata.</p>
            
            <div class="details">
              <div class="details-row">
                <span class="label">Typ poukazu</span>
                <span class="value">${voucherType === 'cash' ? `Poukaz na částku ${safeAmount} Kč` : `Poukaz na ${safeService}${safePackage ? ` - ${safePackage}` : ''}`}</span>
              </div>
              <div class="details-row">
                <span class="label">Způsob platby</span>
                <span class="value">Hotově v salonu</span>
              </div>
            </div>
            
            <div class="important">
              <p class="text" style="margin: 0;"><strong>✓ Další kroky:</strong> Poukaz si můžete vyzvednout a zaplatit přímo v našem salonu. Po zaplacení vám poukaz vytiskneme nebo zašleme na email.</p>
            </div>
            
            <div class="contact">
              <p class="text" style="margin-bottom: 12px;"><strong>SW Beauty</strong></p>
              <p class="text" style="margin: 4px 0; font-size: 14px;">U Cihelny 1326/4, 695 01 Hodonín</p>
              <p class="text" style="margin: 4px 0; font-size: 14px;">Tel: <a href="tel:+420776632498" style="color: #1c1917; text-decoration: none;">+420 776 632 498</a></p>
              <p class="text" style="margin: 4px 0; font-size: 14px;">Email: <a href="mailto:info@swbeauty.cz" style="color: #1c1917; text-decoration: none;">info@swbeauty.cz</a></p>
            </div>
            
            <p class="text" style="color: #78716c; font-size: 13px; margin-top: 20px; text-align: center;">
              Těšíme se na vaši návštěvu!
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export { resend };
