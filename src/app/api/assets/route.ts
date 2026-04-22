import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demoStore';
import { getPrismaClient } from '@/lib/prisma';

export async function GET() {
  try {
    const prisma = getPrismaClient();
    const assets = await prisma.asset.findMany({
      orderBy: { label: 'asc' }
    });
    return NextResponse.json(assets);
  } catch (error) {
    console.error('Failed to fetch assets:', error);
    return NextResponse.json(getDemoStore().assets);
  }
}

export async function POST(request: Request) {
  const data = await request.json();

  try {
    const prisma = getPrismaClient();
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
    const store = getDemoStore();
    const asset = {
      id: data.label ?? `AST-${Date.now()}`,
      label: data.label ?? `AST-${Date.now()}`,
      name: data.name,
      type: data.type,
      location: data.location,
      health: data.health || 100,
      status: data.status || 'Active',
      uptime: data.uptime || '100%',
    };
    store.assets.unshift(asset);
    return NextResponse.json(asset, { status: 201 });
  }
}
