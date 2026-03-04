import { NextRequest, NextResponse } from 'next/server';
import { generateHash } from '@/lib/utils/email-templates';
import { bookingOwnerEmailTemplate, bookingClientInitialEmailTemplate } from '@/lib/booking-templates';
import { rateLimit } from '@/lib/rate-limiter';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getEarliestBookableDate(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

function parseBookingDate(dateValue: string): Date | null {
  const parsed = new Date(`${dateValue}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Rate limiting
    try {
      rateLimit(clientIp, 3, 300000);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 429 });
    }

    const body = await request.json();
    const service = String(body.service || '').trim();
    const packageName = String(body.packageName || '').trim();
    const date = String(body.date || '').trim();
    const time = String(body.time || '').trim();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const note = String(body.note || '').trim();

    if (!service || !date || !time || !name || !email || !phone) {
      return NextResponse.json({ error: 'Chybí povinné údaje.' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Zadejte prosím platný email.' }, { status: 400 });
    }

    const parsedDate = parseBookingDate(date);
    if (!parsedDate) {
      return NextResponse.json({ error: 'Neplatné datum rezervace.' }, { status: 400 });
    }

    if (parsedDate < getEarliestBookableDate()) {
      return NextResponse.json({ error: 'Rezervace je možná nejdříve od zítřka.' }, { status: 400 });
    }

    if (isWeekend(parsedDate)) {
      return NextResponse.json({ error: 'Rezervace o víkendu nejsou dostupné.' }, { status: 400 });
    }

    const hash = generateHash(email, date, time);
    const params = new URLSearchParams({
      service,
      date,
      time,
      name,
      email,
      phone,
      key: hash,
      ...(packageName && { package: packageName }),
      ...(note && { note }),
    });

    const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '');
    const forwardedProto = request.headers.get('x-forwarded-proto');
    const forwardedHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const requestBaseUrl = forwardedHost
      ? `${forwardedProto || 'https'}://${forwardedHost}`
      : new URL(request.url).origin;
    const baseUrl = configuredBaseUrl || requestBaseUrl;

    const confirmUrl = `${baseUrl}/api/confirm-booking?${params.toString()}`;

    // Send emails via Resend
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);

    const clientEmail = await resend.emails.send({
      from: 'SW Beauty <noreply@swbeauty.cz>',
      to: email,
      subject: 'Žádost o rezervaci - SW Beauty',
      html: bookingClientInitialEmailTemplate(name, service, packageName || '', date, time),
    });

    if (clientEmail.error) {
      console.error('Failed to send client booking email:', clientEmail.error);
      return NextResponse.json({ error: 'Nepodařilo se odeslat potvrzovací email klientovi.' }, { status: 502 });
    }

    const ownerEmail = await resend.emails.send({
      from: 'SW Beauty <noreply@swbeauty.cz>',
      to: 'info@swbeauty.cz',
      subject: `Nová rezervace - ${name}`,
      html: bookingOwnerEmailTemplate(service, packageName || '', date, time, name, email, phone, note || '', confirmUrl),
    });

    if (ownerEmail.error) {
      console.error('Failed to send owner booking email:', ownerEmail.error);
      return NextResponse.json({
        success: true,
        warning: 'Klientský email byl odeslán, interní upozornění se nepodařilo doručit.',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
