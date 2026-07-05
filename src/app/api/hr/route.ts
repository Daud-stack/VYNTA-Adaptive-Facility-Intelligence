export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employeeProfile.findMany({
      include: {
        user: { select: { name: true, email: true, role: true } }
      },
      orderBy: { department: 'asc' }
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch HR data' }, { status: 500 });
  }
}

