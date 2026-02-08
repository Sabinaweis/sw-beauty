import { escapeHtml } from '../utils';

export function ownerEmailTemplate(
  recipientName: string,
  recipientEmail: string,
  recipientPhone: string,
  voucherType: string,
  amount: string,
  service: string,
  packageName: string,
  message: string,
  paymentMethod: string,
  confirmUrl: string
): string {
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
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #44403c; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .button { display: inline-block; padding: 16px 32px; background: #1c1917; color: white; text-decoration: none; margin: 20px 0; }
          .details { background: #fafaf9; padding: 20px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Nová objednávka poukazu</h1>
          <p>Obdarovaný: ${safeName}</p>
          <p>Email: ${safeEmail}</p>
          <p>Typ: ${voucherType === 'cash' ? 'Na částku' : 'Na proceduru'}</p>
          <p>Hodnota: ${voucherType === 'cash' ? safeAmount : safeService}</p>
          <a href="${confirmUrl}" class="button">Potvrdit platbu a odeslat poukaz</a>
        </div>
      </body>
    </html>
  `;
}

export function customerPaymentInstructionsTemplate(
  recipientName: string,
  voucherType: string,
  amount: string,
  service: string,
  packageName: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Platební pokyny</h1>
        <p>Pro dokončení objednávky prosím uhraďte částku na účet.</p>
        <p><strong>Číslo účtu:</strong> 6657095339/0800</p>
        <p><strong>Variabilní symbol:</strong> ${Date.now().toString().slice(-8)}</p>
        <p>Poukaz obdržíte po připsání platby.</p>
      </body>
    </html>
  `;
}

export function customerCashConfirmationTemplate(
  recipientName: string,
  voucherType: string,
  amount: string,
  service: string,
  packageName: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Potvrzení objednávky</h1>
        <p>Vaše objednávka byla přijata.</p>
        <p>Můžete zaplatit hotově v salonu při vyzvednutí poukazu.</p>
      </body>
    </html>
  `;
}