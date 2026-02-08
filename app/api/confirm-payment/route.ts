import { NextRequest, NextResponse } from 'next/server';
import { resend, generateHash } from '../../../lib/utils/email-templates.js';

// Voucher email template function
function voucherEmailTemplate(recipientName: string, voucherType: string, amount: string, service: string, message: string) {
  const voucherValue = voucherType === 'cash' ? `${parseInt(amount).toLocaleString()} Kč` : service;

  // Generate print URL
  const printParams = new URLSearchParams({
    name: recipientName,
    type: voucherType,
  });
  if (voucherType === 'cash') {
    printParams.append('amount', amount);
  } else {
    printParams.append('service', service);
  }
  if (message) {
    printParams.append('message', message);
  }
  const printUrl = `https://swbeauty.cz/voucher?${printParams.toString()}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #44403c; margin: 0; padding: 0; background: #fafaf9; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding: 30px 0; }
          .voucher-card { 
            background: white; 
            border: 2px solid #d6d3d1; 
            padding: 60px 40px; 
            margin: 30px 0; 
            position: relative;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          .corner-accent { position: absolute; width: 40px; height: 40px; border: 2px solid #d6d3d1; opacity: 0.3; }
          .corner-tl { top: 0; left: 0; border-right: none; border-bottom: none; }
          .corner-br { bottom: 0; right: 0; border-left: none; border-top: none; }
          .label-small { color: #a8a29e; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; text-align: center; margin-bottom: 10px; }
          .voucher-logo { text-align: center; font-size: 28px; font-weight: 400; color: #1c1917; margin-bottom: 10px; }
          .divider { width: 60px; height: 1px; background: #d6d3d1; margin: 0 auto 40px; }
          .recipient-name { text-align: center; font-size: 48px; font-weight: 400; color: #1c1917; margin: 20px 0; line-height: 1.2; }
          .message { text-align: center; font-size: 14px; color: #78716c; font-style: italic; margin: 20px auto; max-width: 80%; min-height: 1em; }
          .voucher-value { text-align: center; font-size: 48px; font-weight: 400; color: #1c1917; margin-top: 40px; padding-top: 30px; border-top: 1px solid #d6d3d1; }
          .print-button { display: inline-block; background: #1c1917; color: white; padding: 16px 32px; text-decoration: none; font-size: 12px; text-transform: uppercase; letter-spacing: 0.15em; margin: 20px 0; }
          .footer { text-align: center; color: #78716c; font-size: 13px; padding: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px; font-weight: 300; color: #1c1917;">Váš dárkový poukaz</h1>
            <p style="margin: 10px 0 0; color: #78716c; font-size: 14px;">SW Beauty</p>
          </div>
          
          <div class="voucher-card">
            <div class="corner-accent corner-tl"></div>
            <div class="corner-accent corner-br"></div>
            
            <div class="voucher-logo">SW Beauty</div>
            <div class="divider"></div>
            
            <div class="label-small">Pro</div>
            <div class="recipient-name">${recipientName}</div>
            <div class="message">${message ? `„${message}"` : ''}</div>
            
            <div class="label-small" style="margin-top: 40px;">${voucherType === 'cash' ? 'V hodnotě' : 'Na proceduru'}</div>
            <div class="voucher-value">${voucherValue}</div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${printUrl}" class="print-button">Zobrazit poukaz k tisku</a>
          </div>
          
          <div class="footer">
            <p>Platnost poukazu: 12 měsíců od zakoupení</p>
            <p>SW Beauty | swbeauty.cz | +420 776 632 498</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function successHTML(email: string) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background: #fafaf9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 100px auto;
            background: white;
            padding: 60px 40px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          h1 {
            font-size: 48px;
            margin: 0 0 20px;
            color: #1c1917;
            font-weight: 300;
          }
          p {
            color: #78716c;
            font-size: 16px;
            line-height: 1.6;
          }
          .email {
            font-weight: 500;
            color: #1c1917;
          }
          .logo {
            margin-top: 40px;
            color: #a8a29e;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Poukaz odeslán</h1>
          <p>Poukaz byl úspěšně odeslán na email:</p>
          <p class="email">${email}</p>
          <p style="margin-top: 30px; font-size: 14px;">Klient obdrží email s krásným dárkovým poukazem během několika minut.</p>
          <div class="logo">SW Beauty</div>
        </div>
      </body>
    </html>
  `;
}

const errorHTML = `
  <!DOCTYPE html>
  <html>
    <body style="font-family: sans-serif; text-align: center; padding: 50px; color: #44403c;">
      <h1 style="color: #dc2626;">❌ Chyba</h1>
      <p>Něco se pokazilo. Zkuste to prosím znovu později.</p>
    </body>
  </html>
`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const name = searchParams.get('name');
  const type = searchParams.get('type');
  const amount = searchParams.get('amount');
  const service = searchParams.get('service');
  const message = searchParams.get('message');
  const key = searchParams.get('key');

  if (!email || !name || !type || !key) {
    return new NextResponse('Missing required parameters', { status: 400 });
  }

  const expectedHash = generateHash(email, amount || '', service || '');
  if (key !== expectedHash) {
    return new NextResponse(`<!DOCTYPE html><html><body style="font-family: sans-serif; text-align: center; padding: 50px; color: #44403c;"><h1 style="color: #dc2626;">❌ Neplatný odkaz</h1><p>Tento odkaz není platný nebo již vypršel.</p></body></html>`, { status: 403, headers: { 'Content-Type': 'text/html' } });
  }

  try {
    await resend.emails.send({
      from: 'SW Beauty <noreply@swbeauty.cz>',
      to: email,
      subject: 'Váš dárkový poukaz SW Beauty',
      html: voucherEmailTemplate(name, type, amount || '', service || '', message || '')
    });

    return new NextResponse(successHTML(email), { headers: { 'Content-Type': 'text/html' } });
  } catch (error) {
    console.error('Error confirming payment:', error);
    return new NextResponse(errorHTML, { status: 500, headers: { 'Content-Type': 'text/html' } });
  }
}