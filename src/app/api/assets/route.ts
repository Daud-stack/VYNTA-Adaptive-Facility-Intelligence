import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const assets = await prisma.asset.findMany({
      orderBy: { label: 'asc' }
    });
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    return NextResponse.json({ error: 'Failed to fetch assets' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const asset = await prisma.asset.create({
      data: {
        label: data.label,
        name: data.name,
        type: data.type,
        location: data.location,
        health: data.health || 100,
        status: data.status || 'Active',
        uptime: data.uptime || '100%'
      }
    });
    return NextResponse.json(asset);
  } catch (error) {
    console.error('Failed to create asset:', error);
    return NextResponse.json({ error: 'Failed to create asset' }, { status: 500 });
  }
}
