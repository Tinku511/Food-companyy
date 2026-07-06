import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: 'You must be logged in to checkout' }, { status: 401 });
    }

    const body = await req.json();
    const checkoutSchema = z.object({
      shippingAddress: z
        .string()
        .min(10, 'Please provide a complete shipping address (min 10 characters)'),
      notes: z.string().optional(),
    });

    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0].message }, { status: 400 });
    }

    const { shippingAddress, notes } = parsed.data;

    // Fetch the cart from the DB — never trust client prices
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ message: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total server-side from authoritative DB prices
    const totalAmount = cart.items.reduce((acc, item) => {
      return acc + Number(item.product.price) * item.quantity;
    }, 0);

    // Razorpay works in the smallest currency unit (paise for INR)
    const amountInPaise = Math.round(totalAmount * 100);

    // Create order in Razorpay
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    // Create a PENDING order in our database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount,
        shippingAddress,
        notes: notes || null,
        razorpayOrderId: razorpayOrder.id,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
    });

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      orderId: order.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ message: 'Failed to create order' }, { status: 500 });
  }
}
