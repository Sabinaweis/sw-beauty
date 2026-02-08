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
            <p><strong>Služba:</strong> ${escapeHtml(service)}</p>
            <p><strong>Termín:</strong> ${escapeHtml(date)} v ${escapeHtml(time)}</p>
            <p><strong>Klient:</strong> ${escapeHtml(name)}</p>
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
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Děkujeme, ${escapeHtml(name)}</h1>
        <p>Vaše žádost o rezervaci byla odeslána.</p>
        <p><strong>Služba:</strong> ${escapeHtml(service)}</p>
        <p><strong>Termín:</strong> ${escapeHtml(date)} v ${escapeHtml(time)}</p>
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
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>✓ Termín potvrzen</h1>
        <p>Děkujeme, ${escapeHtml(name)}. Váš termín ${escapeHtml(date)} v ${escapeHtml(time)} byl potvrzen.</p>
        <p><strong>Služba:</strong> ${escapeHtml(service)}</p>
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