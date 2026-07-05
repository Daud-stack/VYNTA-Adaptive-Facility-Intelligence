export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const visitors = await prisma.visitor.findMany({
      include: {
        host: {
          select: { name: true, email: true }
        }
      },
      orderBy: { expectedAt: 'desc' }
    });
    return NextResponse.json(visitors);
  } catch (error) {
    console.error('Error fetching visitors:', error);
    return NextResponse.json({ error: 'Failed to fetch visitors' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, purpose, expectedAt, hostId } = body;

    const newVisitor = await prisma.visitor.create({
      data: {
        name,
        email,
        company,
        purpose,
        expectedAt: new Date(expectedAt),
        hostId
      }
    });

    return NextResponse.json(newVisitor, { status: 201 });
  } catch (error) {
    console.error('Error creating visitor:', error);
    return NextResponse.json({ error: 'Failed to create visitor' }, { status: 500 });
  }
}

