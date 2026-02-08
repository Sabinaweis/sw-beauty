import { NextRequest, NextResponse } from 'next/server';
import { resend, generateHash, ownerEmailTemplate, customerPaymentInstructionsTemplate, customerCashConfirmationTemplate } from '@/lib/utils/email-templates';
import { rateLimit } from '@/lib/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    rateLimit(clientIp, 3, 300000);

    const body = await request.json();
    const { recipientName, recipientEmail, recipientPhone, message, voucherType, amount, service, packageName, paymentMethod } = body;

    if (!recipientName || !recipientEmail || !voucherType || !paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (voucherType === 'cash' && !amount) {
      return NextResponse.json({ error: 'Amount is required for cash voucher' }, { status: 400 });
    }

    if (voucherType === 'service' && !service) {
      return NextResponse.json({ error: 'Service is required for service voucher' }, { status: 400 });
    }

    const hash = generateHash(recipientEmail, amount || '', service || '');
    const params = new URLSearchParams({
      email: recipientEmail,
      name: recipientName,
      type: voucherType,
      key: hash
    });

    if (voucherType === 'cash') {
      params.append('amount', amount);
    } else {
      params.append('service', service);
    }

    if (message) {
      params.append('message', message);
    }

    const confirmUrl = `https://swbeauty.cz/api/confirm-payment?${params.toString()}`;

    if (paymentMethod === 'transfer') {
      await resend.emails.send({
        from: 'SW Beauty <noreply@swbeauty.cz>',
        to: recipientEmail,
        subject: 'Platební pokyny - Dárkový poukaz SW Beauty',
        html: customerPaymentInstructionsTemplate(
          recipientName,
          voucherType,
          amount || '',
          service || '',
          packageName || ''
        )
      });
    } else {
      await resend.emails.send({
        from: 'SW Beauty <noreply@swbeauty.cz>',
        to: recipientEmail,
        subject: 'Potvrzení objednávky - Dárkový poukaz SW Beauty',
        html: customerCashConfirmationTemplate(
          recipientName,
          voucherType,
          amount || '',
          service || '',
          packageName || ''
        )
      });
    }

    await resend.emails.send({
      from: 'SW Beauty <noreply@swbeauty.cz>',
      to: 'info@swbeauty.cz',
      subject: `Nová objednávka poukazu - ${recipientName}`,
      html: ownerEmailTemplate(
        recipientName,
        recipientEmail,
        recipientPhone || '',
        voucherType,
        amount || '',
        service || '',
        packageName || '',
        message || '',
        paymentMethod,
        confirmUrl
      )
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error processing voucher order:', error);

    if (error.statusCode === 429) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}