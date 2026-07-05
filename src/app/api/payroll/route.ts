import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const payslips = await prisma.payslip.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: { select: { name: true, email: true } }
      },
      orderBy: { periodStart: 'desc' }
    });
    return NextResponse.json(payslips);
  } catch (error) {
    console.error('Error fetching payslips:', error);
    return NextResponse.json({ error: 'Failed to fetch payroll data' }, { status: 500 });
  }
}
