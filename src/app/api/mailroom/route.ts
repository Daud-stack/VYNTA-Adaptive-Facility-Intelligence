import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const recipientId = searchParams.get('recipientId');

    const consignments = await prisma.consignment.findMany({
      where: recipientId ? { recipientId } : undefined,
      include: {
        recipient: { select: { name: true, email: true } }
      },
      orderBy: { receivedAt: 'desc' }
    });
    return NextResponse.json(consignments);
  } catch (error) {
    console.error('Error fetching consignments:', error);
    return NextResponse.json({ error: 'Failed to fetch consignments' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trackingNumber, carrier, recipientId } = body;

    const newConsignment = await prisma.consignment.create({
      data: {
        trackingNumber,
        carrier,
        recipientId,
        status: 'RECEIVED'
      }
    });

    return NextResponse.json(newConsignment, { status: 201 });
  } catch (error) {
    console.error('Error creating consignment:', error);
    return NextResponse.json({ error: 'Failed to log consignment' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    const updatedConsignment = await prisma.consignment.update({
      where: { id },
      data: {
        status,
        deliveredAt: status === 'DELIVERED' ? new Date() : undefined
      }
    });

    return NextResponse.json(updatedConsignment);
  } catch (error) {
    console.error('Error updating consignment:', error);
    return NextResponse.json({ error: 'Failed to update consignment' }, { status: 500 });
  }
}
