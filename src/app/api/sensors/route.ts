import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demoStore';
import { getPrismaClient } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zone = searchParams.get('zone') || 'Building-Wide';

  try {
    const prisma = getPrismaClient();
    // Fetch latest logs for each sensor type
    const [temp, co2, energy] = await Promise.all([
      prisma.sensorLog.findFirst({ where: { type: 'Temperature' }, orderBy: { timestamp: 'desc' } }),
      prisma.sensorLog.findFirst({ where: { type: 'CO2' }, orderBy: { timestamp: 'desc' } }),
      prisma.sensorLog.findFirst({ where: { type: 'Energy' }, orderBy: { timestamp: 'desc' } }),
    ]);

    return NextResponse.json({
      zone,
      metrics: {
        temperature: temp?.value || 21,
        co2: co2?.value || 450,
        energy: energy?.value || 140
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to fetch sensor metrics:', error);
    return NextResponse.json({
      zone,
      metrics: getDemoStore().sensorMetrics,
      timestamp: new Date().toISOString()
    });
  }
}
