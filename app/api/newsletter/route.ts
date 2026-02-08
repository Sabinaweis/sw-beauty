import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limiter';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    try {
      rateLimit(clientIp, 5, 300000);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 429 });
    }

    const { email } = await request.json();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ error: 'Zadejte prosím platný email.' }, { status: 400 });
    }

    const safeEmail = escapeHtml(String(email));

    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Email služba není nastavena.' }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);

    await resend.emails.send({
      from: 'SW Beauty <noreply@swbeauty.cz>',
      to: 'info@swbeauty.cz',
      subject: 'Nový odběr newsletteru',
      html: `
        <div style="font-family: Arial, sans-serif; color: #44403c;">
          <h2>Nový odběr newsletteru</h2>
          <p>Email: <strong>${safeEmail}</strong></p>
        </div>
      `,
    });

    await resend.emails.send({
      from: 'SW Beauty <noreply@swbeauty.cz>',
      to: email,
      subject: 'Potvrzení odběru newsletteru - SW Beauty',
      html: `
        <div style="font-family: Arial, sans-serif; color: #44403c; line-height: 1.6;">
          <h2>Děkujeme za přihlášení</h2>
          <p>Vaše emailová adresa <strong>${safeEmail}</strong> byla úspěšně přihlášena k odběru newsletteru SW Beauty.</p>
          <p>Pokud jste se nepřihlásili vy, tento email prosím ignorujte.</p>
          <p style="margin-top: 24px;">SW Beauty</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing newsletter signup:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
