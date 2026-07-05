import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const spaces = await prisma.space.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(spaces);
  } catch (error) {
    console.error('Error fetching spaces:', error);
    return NextResponse.json({ error: 'Failed to fetch spaces' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, type, capacity, amenities } = body;

    const newSpace = await prisma.space.create({
      data: {
        name,
        type,
        capacity: parseInt(capacity),
        amenities: JSON.stringify(amenities)
      }
    });

    return NextResponse.json(newSpace, { status: 201 });
  } catch (error) {
    console.error('Error creating space:', error);
    return NextResponse.json({ error: 'Failed to create space' }, { status: 500 });
  }
}
