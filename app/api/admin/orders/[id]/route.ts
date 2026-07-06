import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') throw new Error('Unauthorized');
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const { fulfilmentStatus } = await req.json();

    const validStatuses = ['PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(fulfilmentStatus)) {
      return NextResponse.json({ message: 'Invalid status' }, { status: 400 });
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 });
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { fulfilmentStatus },
    });

    if (
      existingOrder.fulfilmentStatus !== fulfilmentStatus &&
      (fulfilmentStatus === 'SHIPPED' || fulfilmentStatus === 'DELIVERED')
    ) {
      const { sendShippingUpdateEmail } = await import('@/lib/email');
      await sendShippingUpdateEmail(
        order.id,
        existingOrder.user.email,
        existingOrder.user.name,
        fulfilmentStatus,
      );
    }

    return NextResponse.json(order);
  } catch (err: any) {
    if (err.message === 'Unauthorized')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
