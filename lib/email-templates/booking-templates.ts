import { escapeHtml } from '../utils';

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
          .button { display: inline-block; padding: 16px 32px; background: #1c1917; color: white; text-decoration: none; margin: 20px 0; }
          .details { background: #fafaf9; padding: 20px; margin: 20px 0; }
          .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e7e5e4; }
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
            <div class="details">
              <div class="details-row"><span>Služba:</span><span>${safeService}</span></div>
              ${safePackage ? `<div class="details-row"><span>Balíček:</span><span>${safePackage}</span></div>` : ''}
              <div class="details-row"><span>Termín:</span><span>${safeDate} v ${safeTime}</span></div>
              <div class="details-row"><span>Jméno:</span><span>${safeName}</span></div>
              <div class="details-row"><span>Email:</span><span>${safeEmail}</span></div>
              <div class="details-row"><span>Telefon:</span><span>${safePhone}</span></div>
            </div>
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
        ${packageName ? `<p><strong>Balíček:</strong> ${escapeHtml(packageName)}</p>` : ''}
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
        <h1>Potvrzení rezervace</h1>
        <p>Klient: ${escapeHtml(name)}</p>
        <p>Email: ${escapeHtml(email)}</p>
        <p>Telefon: ${escapeHtml(phone)}</p>
        <p>Služba: ${escapeHtml(service)}</p>
        <p>Termín: ${escapeHtml(date)} v ${escapeHtml(time)}</p>
      </body>
    </html>
  `;
}