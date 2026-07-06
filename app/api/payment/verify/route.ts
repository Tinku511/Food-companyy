import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json({ message: 'Missing payment verification fields' }, { status: 400 });
    }

    // -----------------------------------------------------------------------
    // SIGNATURE VERIFICATION
    //
    // How it works:
    // 1. Razorpay sends us three values on the client side:
    //    - razorpay_order_id  (the Order ID we created)
    //    - razorpay_payment_id (assigned by Razorpay after the user pays)
    //    - razorpay_signature  (Razorpay's cryptographic proof of authenticity)
    //
    // 2. We reconstruct what the signature *should* be by:
    //    a. Building the body string: "<order_id>|<payment_id>"
    //    b. Hashing it with HMAC-SHA256, keyed with our private RAZORPAY_KEY_SECRET
    //       (this key never leaves our server, so it cannot be forged)
    //    c. Encoding the result as a hex string
    //
    // 3. If our generated digest === razorpay_signature, the payment is genuine.
    //    If they don't match, the data was tampered with and we reject it.
    // -----------------------------------------------------------------------

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json({ message: 'Payment verification failed: invalid signature' }, { status: 400 });
    }

    // Fetch the order to check if it's already paid, and to get user details
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId, userId: session.user.id },
      include: {
        user: true,
        items: { include: { product: true } }
      }
    });

    if (!existingOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    // Hoist `order` so it's always in scope for the return statement below
    let order = existingOrder;

    if (existingOrder.paymentStatus !== 'PAID') {
      // Signature is valid — update our Order in the database
      order = await prisma.order.update({
        where: { id: orderId, userId: session.user.id },
        data: {
          paymentStatus: 'PAID',
          razorpayPaymentId: razorpay_payment_id,
        },
      });

      // Send the order confirmation email
      const { sendOrderConfirmationEmail } = await import('@/lib/email');
      await sendOrderConfirmationEmail(
        order.id,
        existingOrder.user.email,
        existingOrder.user.name,
        Number(order.totalAmount),
        existingOrder.items.map(i => ({ productName: i.product.name, quantity: i.quantity }))
      );

      // Clear the user's cart since the order was placed successfully
      await prisma.cart.deleteMany({
        where: { userId: session.user.id },
      });
    }

    // Always return the orderId — whether just-paid or already-paid (idempotent)
    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Payment verify error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

