import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const requests = await prisma.travelRequest.findMany({
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error('Error fetching travel requests:', error);
    return NextResponse.json({ error: 'Failed to fetch travel data' }, { status: 500 });
  }
}
