import { NextRequest, NextResponse } from 'next/server';
import { generateHash } from '@/lib/utils/email-templates';
import { bookingClientConfirmedEmailTemplate, bookingOwnerConfirmedEmailTemplate } from '@/lib/booking-templates';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseBookingDate(dateValue: string): Date | null {
  const parsed = new Date(`${dateValue}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// Generování ICS souboru pro kalendář
function generateICS(service: string, packageName: string, date: string, time: string, clientName: string, clientPhone: string, isOwner = false) {
  // Parsování data a času
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);

  // Vytvoření UTC času (předpokládáme CET/CEST - zjednodušeně)
  const startDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // +1 hodina

  // Formátování pro ICS (YYYYMMDDTHHmmss)
  const formatICSDate = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  };

  const uid = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}@swbeauty.cz`;
  const now = formatICSDate(new Date());

  const title = packageName
    ? `${service} - ${packageName}`
    : service;

  const description = isOwner
    ? `Klient: ${clientName}\\nTelefon: ${clientPhone}\\n\\nSW Beauty`
    : `Vaše rezervace v SW Beauty\\n\\nSlužba: ${title}\\n\\nTěšíme se na Vás!`;

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SW Beauty//Booking System//CS
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${now}
DTSTART:${formatICSDate(startDate)}
DTEND:${formatICSDate(endDate)}
SUMMARY:${isOwner ? `${clientName} - ${title}` : `${title} - SW Beauty`}
DESCRIPTION:${description}
LOCATION:U Cihelny 1326/4, 695 01 Hodonín
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get('service') || '';
  const date = searchParams.get('date') || '';
  const time = searchParams.get('time') || '';
  const name = searchParams.get('name') || '';
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';
  const key = searchParams.get('key') || '';
  const packageName = searchParams.get('package') || '';
  const note = searchParams.get('note') || '';

  // Verify the security hash
  const expectedHash = generateHash(email, date, time);
  if (key !== expectedHash) {
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px; color: #44403c;">
          <h1 style="color: #dc2626;">❌ Neplatný odkaz</h1>
          <p>Tento odkaz není platný nebo již vypršel.</p>
        </body>
      </html>
    `, { status: 403, headers: { 'Content-Type': 'text/html' } });
  }

  // Show confirmation form with editable date/time
  return new NextResponse(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Potvrzení rezervace - SW Beauty</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background: #fafaf9;
            margin: 0;
            padding: 20px;
            color: #44403c;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background: white;
            padding: 40px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          h1 {
            font-size: 32px;
            margin: 0 0 10px;
            color: #1c1917;
            font-weight: 300;
          }
          .subtitle {
            color: #78716c;
            font-size: 14px;
            margin: 0 0 30px;
          }
          .detail-box {
            background: #fafaf9;
            padding: 20px;
            margin: 20px 0;
            border-left: 3px solid #1c1917;
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e7e5e4;
          }
          .detail-row:last-child {
            border-bottom: none;
          }
          .label {
            color: #78716c;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .value {
            font-weight: 500;
            color: #1c1917;
          }
          .form-group {
            margin: 20px 0;
          }
          .form-label {
            display: block;
            color: #78716c;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 8px;
          }
          input[type="date"], input[type="time"] {
            width: 100%;
            padding: 12px;
            border: 1px solid #d6d3d1;
            font-size: 14px;
            font-family: inherit;
          }
          input[type="date"]:focus, input[type="time"]:focus {
            outline: none;
            border-color: #1c1917;
          }
          .button {
            width: 100%;
            padding: 16px;
            background: #1c1917;
            color: white;
            border: none;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            cursor: pointer;
            margin-top: 20px;
          }
          .button:hover {
            background: #292524;
          }
          .button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .note {
            color: #78716c;
            font-size: 13px;
            margin-top: 20px;
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Potvrzení rezervace</h1>
          <p class="subtitle">SW Beauty</p>

          <div class="detail-box">
            <div class="detail-row">
              <span class="label">Klient</span>
              <span class="value">${name}</span>
            </div>
            <div class="detail-row">
              <span class="label">Email</span>
              <span class="value">${email}</span>
            </div>
            <div class="detail-row">
              <span class="label">Telefon</span>
              <span class="value">${phone}</span>
            </div>
            <div class="detail-row">
              <span class="label">Služba</span>
              <span class="value">${service}</span>
            </div>
            ${packageName ? `
            <div class="detail-row">
              <span class="label">Balíček</span>
              <span class="value">${packageName}</span>
            </div>
            ` : ''}
            ${note ? `
            <div class="detail-row">
              <span class="label">Poznámka</span>
              <span class="value">${note}</span>
            </div>
            ` : ''}
            <div class="detail-row">
              <span class="label">Preferovaný termín</span>
              <span class="value">${date} v ${time}</span>
            </div>
          </div>

          <p style="font-size: 14px; color: #78716c; margin: 30px 0 20px;">
            Po telefonické domluvě s klientem zadejte finální termín:
          </p>

          <form id="confirmForm" method="POST">
            <input type="hidden" name="service" value="${service}">
            <input type="hidden" name="packageName" value="${packageName}">
            <input type="hidden" name="name" value="${name}">
            <input type="hidden" name="email" value="${email}">
            <input type="hidden" name="phone" value="${phone}">
            <input type="hidden" name="key" value="${key}">
            <input type="hidden" name="originalDate" value="${date}">
            <input type="hidden" name="originalTime" value="${time}">

            <div class="form-group">
              <label class="form-label" for="finalDate">Finální datum</label>
              <input type="date" id="finalDate" name="finalDate" value="${date}" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="finalTime">Finální čas</label>
              <input type="time" id="finalTime" name="finalTime" value="${time}" required>
            </div>

            <button type="submit" class="button" id="submitBtn">
              Potvrdit a odeslat klientovi
            </button>
          </form>

          <p class="note">
            Kliknutím na tlačítko odešlete potvrzovací email klientovi na adresu <strong>${email}</strong> s finálním termínem.
          </p>
        </div>

        <script>
          document.getElementById('confirmForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            btn.disabled = true;
            btn.textContent = 'Odesílám...';

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);

            try {
              const response = await fetch(window.location.pathname + window.location.search, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
              });

              if (response.ok) {
                document.body.innerHTML = \`
                  <div style="max-width: 600px; margin: 100px auto; text-align: center; padding: 40px;">
                    <h1 style="font-size: 48px; margin: 0 0 20px; color: #15803d;">✓</h1>
                    <h2 style="font-size: 24px; margin: 0 0 10px; color: #1c1917;">Rezervace potvrzena</h2>
                    <p style="color: #78716c;">Email s potvrzením byl odeslán klientovi i vám.</p>
                  </div>
                \`;
              } else {
                alert('Něco se pokazilo. Zkuste to prosím znovu.');
                btn.disabled = false;
                btn.textContent = 'Potvrdit a odeslat klientovi';
              }
            } catch (error) {
              alert('Chyba spojení. Zkuste to prosím znovu.');
              btn.disabled = false;
              btn.textContent = 'Potvrdit a odeslat klientovi';
            }
          });
        </script>
      </body>
    </html>
  `, { headers: { 'Content-Type': 'text/html' } });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const service = String(body.service || '').trim();
    const packageName = String(body.packageName || '').trim();
    const originalDate = String(body.originalDate || '').trim();
    const originalTime = String(body.originalTime || '').trim();
    const finalDate = String(body.finalDate || '').trim();
    const finalTime = String(body.finalTime || '').trim();
    const key = String(body.key || '').trim();

    if (!name || !email || !phone || !service || !originalDate || !originalTime || !finalDate || !finalTime || !key) {
      return NextResponse.json({ error: 'Chybí povinné údaje.' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Neplatný email klienta.' }, { status: 400 });
    }

    const parsedFinalDate = parseBookingDate(finalDate);
    if (!parsedFinalDate) {
      return NextResponse.json({ error: 'Neplatné finální datum.' }, { status: 400 });
    }

    if (isWeekend(parsedFinalDate)) {
      return NextResponse.json({ error: 'Rezervace o víkendu nejsou dostupné.' }, { status: 400 });
    }

    // Verify the security hash with original date/time
    const expectedHash = generateHash(email, originalDate, originalTime);
    if (key !== expectedHash) {
      return NextResponse.json({ error: 'Invalid key' }, { status: 403 });
    }

    // Generování ICS souborů
    const clientICS = generateICS(
      service,
      packageName,
      finalDate,
      finalTime,
      name,
      phone,
      false // pro klienta
    );

    const ownerICS = generateICS(
      service,
      packageName,
      finalDate,
      finalTime,
      name,
      phone,
      true // pro majitelku
    );

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);

    // Send confirmation email to client with ICS attachment
    const clientEmail = await resend.emails.send({
      from: 'SW Beauty <noreply@swbeauty.cz>',
      to: email,
      subject: 'Potvrzení termínu - SW Beauty',
      html: bookingClientConfirmedEmailTemplate(
        name,
        service,
        packageName,
        finalDate,
        finalTime
      ),
      attachments: [
        {
          filename: 'rezervace-sw-beauty.ics',
          content: Buffer.from(clientICS).toString('base64'),
          contentType: 'text/calendar; charset=utf-8'
        }
      ]
    });

    if (clientEmail.error) {
      console.error('Failed to send client booking confirmation email:', clientEmail.error);
      return NextResponse.json({ error: 'Nepodařilo se odeslat potvrzení klientovi.' }, { status: 502 });
    }

    // Send confirmation email to owner with ICS attachment
    const ownerEmail = await resend.emails.send({
      from: 'SW Beauty <noreply@swbeauty.cz>',
      to: 'info@swbeauty.cz',
      subject: `Potvrzeno: ${name} - ${service} (${finalDate} ${finalTime})`,
      html: bookingOwnerConfirmedEmailTemplate(
        name,
        email,
        phone,
        service,
        packageName,
        finalDate,
        finalTime
      ),
      attachments: [
        {
          filename: 'rezervace.ics',
          content: Buffer.from(ownerICS).toString('base64'),
          contentType: 'text/calendar; charset=utf-8'
        }
      ]
    });

    if (ownerEmail.error) {
      console.error('Failed to send owner booking confirmation email:', ownerEmail.error);
      return NextResponse.json({
        success: true,
        warning: 'Klientský email byl odeslán, interní potvrzení se nepodařilo doručit.',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error confirming booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
