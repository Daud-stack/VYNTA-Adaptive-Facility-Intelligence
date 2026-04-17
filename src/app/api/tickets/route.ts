import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Failed to fetch tickets:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
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
    return NextResponse.json({ error: 'Failed to create ticket' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, ...updates } = data;
    
    const ticket = await prisma.ticket.update({
      where: { id },
      data: updates
    });
    
    return NextResponse.json(ticket);
  } catch (error) {
    console.error('Failed to update ticket:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
