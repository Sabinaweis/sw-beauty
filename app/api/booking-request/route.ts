import { NextRequest, NextResponse } from 'next/server';
import { generateHash } from '@/lib/utils/email-templates';
import { bookingOwnerEmailTemplate, bookingClientInitialEmailTemplate } from '@/lib/booking-templates';
import { rateLimit } from '@/lib/rate-limiter';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Rate limiting
    try {
      rateLimit(clientIp, 3, 300000);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 429 });
    }

    const { service, packageName, date, time, name, email, phone, note } = await request.json();

    if (!service || !date || !time || !name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
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

    const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/confirm-booking?${params.toString()}`;

    // Send emails via Resend
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
    }

    const resend = new Resend(RESEND_API_KEY);

    await resend.emails.send({
      from: 'SW Beauty <noreply@swbeauty.cz>',
      to: 'info@swbeauty.cz',
      subject: `Nová rezervace - ${name}`,
      html: bookingOwnerEmailTemplate(service, packageName || '', date, time, name, email, phone, note || '', confirmUrl),
    });

    await resend.emails.send({
      from: 'SW Beauty <noreply@swbeauty.cz>',
      to: email,
      subject: 'Žádost o rezervaci - SW Beauty',
      html: bookingClientInitialEmailTemplate(name, service, packageName || '', date, time),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
