import { escapeHtml } from './utils';

// Helper function to generate security hash
export function generateHash(email: string, amount: string, service: string = ''): string {
  const secret = process.env.VOUCHER_SECRET || 'default-secret-change-me';
  const data = `${email}-${amount}-${service}-${secret}`;

  // Simple hash implementation (Node.js)
  if (typeof window === 'undefined') {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Client-side fallback
  return btoa(data).replace(/[^a-zA-Z0-9]/g, '').substring(0, 64);
}

export function bookingOwnerEmailTemplate(
  service: string,
  packageName: string,
  date: string,
  time: string,
  name: string,
  email: string,
  phone: string,
  note: string,
  confirmUrl: string
): string {
  const safeService = escapeHtml(service);
  const safePackage = escapeHtml(packageName);
  const safeDate = escapeHtml(date);
  const safeTime = escapeHtml(time);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeNote = escapeHtml(note);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #44403c; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 0; border-bottom: 1px solid #e7e5e4; }
          .button { display: inline-block; padding: 16px 32px; background: #1c1917; color: white; text-decoration: none; margin: 20px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>SW Beauty</h1>
            <p>Nová rezervace</p>
          </div>
          <div>
            <h2>Dobrý den,</h2>
            <p>Přišla nová žádost o rezervaci.</p>
            <p><strong>Služba:</strong> ${safeService}</p>
            ${safePackage ? `<p><strong>Balíček:</strong> ${safePackage}</p>` : ''}
            <p><strong>Termín:</strong> ${safeDate} v ${safeTime}</p>
            <p><strong>Klient:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Telefon:</strong> ${safePhone}</p>
            ${safeNote ? `<p><strong>Poznámka:</strong> ${safeNote}</p>` : ''}
            <a href="${confirmUrl}" class="button">Potvrdit termín</a>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function bookingClientInitialEmailTemplate(
  name: string,
  service: string,
  packageName: string,
  date: string,
  time: string
): string {
  const safeName = escapeHtml(name);
  const safeService = escapeHtml(service);
  const safePackage = escapeHtml(packageName);
  const safeDate = escapeHtml(date);
  const safeTime = escapeHtml(time);

  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Děkujeme, ${safeName}</h1>
        <p>Vaše žádost o rezervaci byla odeslána.</p>
        <p><strong>Služba:</strong> ${safeService}</p>
        ${safePackage ? `<p><strong>Balíček:</strong> ${safePackage}</p>` : ''}
        <p><strong>Termín:</strong> ${safeDate} v ${safeTime}</p>
        <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e7e5e4;" />
        <h2 style="margin: 0 0 8px; font-size: 18px;">Platební údaje</h2>
        <p style="margin: 4px 0;"><strong>Příjemce:</strong> SW Beauty (Weisbergerova)</p>
        <p style="margin: 4px 0;"><strong>IBAN:</strong> CZ51 0800 0000 0066 5709 5339</p>
        <p style="margin: 4px 0;"><strong>SWIFT:</strong> GIBACZPX</p>
        <p style="margin: 4px 0;"><strong>Bankovní účet:</strong> 6657095339/0800</p>
      </body>
    </html>
  `;
}

export function bookingClientConfirmedEmailTemplate(
  name: string,
  service: string,
  packageName: string,
  date: string,
  time: string
): string {
  const safeName = escapeHtml(name);
  const safeService = escapeHtml(service);
  const safePackage = escapeHtml(packageName);
  const safeDate = escapeHtml(date);
  const safeTime = escapeHtml(time);

  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>✓ Termín potvrzen</h1>
        <p>Děkujeme, ${safeName}. Váš termín ${safeDate} v ${safeTime} byl potvrzen.</p>
        <p><strong>Služba:</strong> ${safeService}</p>
        ${safePackage ? `<p><strong>Balíček:</strong> ${safePackage}</p>` : ''}
        <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e7e5e4;" />
        <h2 style="margin: 0 0 8px; font-size: 18px;">Platební údaje</h2>
        <p style="margin: 4px 0;"><strong>Příjemce:</strong> SW Beauty (Weisbergerova)</p>
        <p style="margin: 4px 0;"><strong>IBAN:</strong> CZ51 0800 0000 0066 5709 5339</p>
        <p style="margin: 4px 0;"><strong>SWIFT:</strong> GIBACZPX</p>
        <p style="margin: 4px 0;"><strong>Bankovní účet:</strong> 6657095339/0800</p>
      </body>
    </html>
  `;
}

export function bookingOwnerConfirmedEmailTemplate(
  name: string,
  email: string,
  phone: string,
  service: string,
  packageName: string,
  date: string,
  time: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Rezervace potvrzena</h1>
        <p>Klient: ${escapeHtml(name)}</p>
        <p>Email: ${escapeHtml(email)}</p>
        <p>Telefon: ${escapeHtml(phone)}</p>
        <p>Služba: ${escapeHtml(service)}</p>
        <p>Termín: ${escapeHtml(date)} v ${escapeHtml(time)}</p>
      </body>
    </html>
  `;
}
