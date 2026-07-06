export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';

export async function GET() {
  try {
    const prisma = getPrismaClient();

    // Fetch Maintenance Policies
    const policies = await prisma.maintenancePolicy.findMany({
      include: { asset: true }
    });

    // Fetch Active Tickets related to maintenance
    // Assuming tickets with 'Maintenance' in title or just some active tickets
    const activeTickets = await prisma.ticket.findMany({
      where: { status: 'IN_PROGRESS' },
      take: 10
    });

    const schedule = [];

    // Map Policies
    policies.forEach((policy, i) => {
      // Simulate timeline placement based on nextRunAt relative to now
      // This is a simplified projection for the 4-week timeline UI
      const start = (i * 15) % 80; 
      schedule.push({
        asset: policy.asset?.name || `Asset-${policy.assetId.substring(0,4)}`,
        start: start,
        width: 15,
        color: '#10b981', // green for scheduled preventive
        status: 'Preventive'
      });
    });

    // Map Active Tickets
    activeTickets.forEach((ticket, i) => {
      schedule.push({
        asset: `Ticket: ${ticket.ticketId}`,
        start: (i * 25 + 5) % 70,
        width: 25,
        color: '#f87171', // red for active repair
        status: 'Repair'
      });
    });

    // Add fallback if empty so the UI doesn't look completely barren
    if (schedule.length === 0) {
      schedule.push({ asset: 'Chiller-04', start: 10, width: 20, color: '#10b981', status: 'Preventive' });
      schedule.push({ asset: 'Elevator-A1', start: 40, width: 15, color: '#fbbf24', status: 'Inspection' });
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Failed to fetch maintenance:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
