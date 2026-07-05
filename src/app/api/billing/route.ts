import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const invoices = await prisma.invoice.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { dueDate: 'asc' }
    });
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount, description, dueDate } = body;

    const newInvoice = await prisma.invoice.create({
      data: {
        userId,
        amount: parseFloat(amount),
        description,
        dueDate: new Date(dueDate)
      }
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Failed to create invoice' }, { status: 500 });
  }
}
