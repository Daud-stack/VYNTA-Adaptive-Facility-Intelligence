import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demoStore';
import { getPrismaClient } from '@/lib/prisma';
import { mockEnergyTelemetry } from '@/lib/mockData';

export async function GET() {
  try {
    const prisma = getPrismaClient();
    const logs = await prisma.sensorLog.findMany({
      where: { type: 'Energy' },
      orderBy: { timestamp: 'desc' },
      take: 20
    });

    if (logs.length === 0) {
      // Return mock data if database is empty to prevent UI break
      return NextResponse.json(mockEnergyTelemetry);
    }

    return NextResponse.json(logs.map(log => ({
      time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      usage: log.value,
      pue: 1.2 + (Math.random() * 0.3) // PUE simulation based on usage if not in DB
    })));
  } catch (error) {
    console.error('Failed to fetch energy logs:', error);
    return NextResponse.json(getDemoStore().energyTelemetry.length > 0 ? getDemoStore().energyTelemetry : mockEnergyTelemetry);
  }
}
