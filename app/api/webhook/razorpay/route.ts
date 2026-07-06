import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

// Razorpay sends webhook events as raw body — we must read it as text
export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const webhookSignature = req.headers.get('x-razorpay-signature');

    if (!webhookSignature) {
      return NextResponse.json({ message: 'Missing webhook signature' }, { status: 400 });
    }

    // -----------------------------------------------------------------------
    // WEBHOOK SIGNATURE VERIFICATION
    //
    // This is an independent second-layer confirmation.
    // Even if the user closes their browser after payment (before our frontend
    // calls /api/payment/verify), Razorpay will still POST to this endpoint.
    //
    // Verification:
    // 1. Razorpay sends the raw request body + its HMAC signature.
    // 2. We hash the raw body using HMAC-SHA256 keyed with our WEBHOOK_SECRET.
    // 3. If our hash matches the header, the event is genuinely from Razorpay.
    // -----------------------------------------------------------------------
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== webhookSignature) {
      console.error('Webhook signature mismatch — potential spoofing attempt.');
      return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === 'payment.captured' || event === 'order.paid') {
      const razorpayOrderId = payload?.payload?.payment?.entity?.order_id
        ?? payload?.payload?.order?.entity?.id;

      const razorpayPaymentId = payload?.payload?.payment?.entity?.id;

      if (!razorpayOrderId) {
        return NextResponse.json({ message: 'Missing order_id in payload' }, { status: 400 });
      }

      // Find the matching order in our DB, along with user and items
      const order = await prisma.order.findUnique({
        where: { razorpayOrderId },
        include: {
          user: true,
          items: { include: { product: true } }
        }
      });

      if (!order) {
        // Order not found yet (can happen in edge cases) — return 200 to
        // prevent Razorpay from retrying, since this is not an error.
        return NextResponse.json({ message: 'Order not found, ignoring' });
      }

      // Idempotently update to PAID — only update if still PENDING
      if (order.paymentStatus === 'PENDING') {
        const updatedOrder = await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentStatus: 'PAID',
            razorpayPaymentId: razorpayPaymentId ?? null,
          },
        });

        // Send the order confirmation email
        const { sendOrderConfirmationEmail } = await import('@/lib/email');
        await sendOrderConfirmationEmail(
          updatedOrder.id,
          order.user.email,
          order.user.name,
          Number(updatedOrder.totalAmount),
          order.items.map(i => ({ productName: i.product.name, quantity: i.quantity }))
        );

        // Optionally clear the cart here as well
        await prisma.cart.deleteMany({
          where: { userId: order.userId },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}
