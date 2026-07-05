import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const records = await prisma.attendanceRecord.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: { select: { name: true, role: true } }
      },
      orderBy: { clockIn: 'desc' }
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, type, location } = body;

    if (type === 'CLOCK_IN') {
      const record = await prisma.attendanceRecord.create({
        data: {
          userId,
          clockIn: new Date(),
          location
        }
      });
      return NextResponse.json(record, { status: 201 });
    } 
    
    if (type === 'CLOCK_OUT') {
      // Find the most recent active clock-in for this user
      const activeRecord = await prisma.attendanceRecord.findFirst({
        where: { userId, clockOut: null },
        orderBy: { clockIn: 'desc' }
      });

      if (!activeRecord) {
        return NextResponse.json({ error: 'No active clock-in found' }, { status: 400 });
      }

      const updatedRecord = await prisma.attendanceRecord.update({
        where: { id: activeRecord.id },
        data: { clockOut: new Date() }
      });

      return NextResponse.json(updatedRecord);
    }

    return NextResponse.json({ error: 'Invalid action type' }, { status: 400 });
  } catch (error) {
    console.error('Error processing attendance:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
