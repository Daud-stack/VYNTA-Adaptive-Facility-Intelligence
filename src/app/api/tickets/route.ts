import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demoStore';
import { getPrismaClient } from '@/lib/prisma';

export async function GET() {
  try {
    const prisma = getPrismaClient();
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    return NextResponse.json(getDemoStore().tickets);
  }
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const prisma = getPrismaClient();
    const ticket = await prisma.ticket.create({
      data: {
        ticketId: data.ticketId,
        title: data.title,
        user: data.user,
        priority: data.priority || 'Medium',
        status: data.status || 'Unassigned',
        timestamp: data.timestamp || 'Just now',
      }
    });
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Failed to create ticket:', error);
    const store = getDemoStore();
    const ticket = {
      id: `demo-${Date.now()}`,
      ticketId: data.ticketId ?? `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: data.title,
      user: data.user ?? 'Anonymous Tenant',
      priority: data.priority || 'Medium',
      status: data.status || 'Unassigned',
      timestamp: data.timestamp || 'Just now',
      createdAt: new Date().toISOString(),
    };
    store.tickets.unshift(ticket);
    return NextResponse.json(ticket, { status: 201 });
  }
}

export async function PUT(request: Request) {
  const data = await request.json();

  try {
    const prisma = getPrismaClient();
    const { id, ...updates } = data;
    
    const ticket = await prisma.ticket.update({
      where: { id },
      data: updates
    });
    
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Failed to update ticket:', error);
    const store = getDemoStore();
    const ticket = store.tickets.find((item) => item.id === data.id);

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    Object.assign(ticket, data);
    return NextResponse.json(ticket);
  }
}
