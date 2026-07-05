import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const menuItems = await prisma.menuItem.findMany({
      where: { isAvailable: true },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, menuItemId, quantity } = body;

    const newOrder = await prisma.cafeteriaOrder.create({
      data: {
        userId,
        menuItemId,
        quantity: parseInt(quantity) || 1
      }
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to place order' }, { status: 500 });
  }
}
