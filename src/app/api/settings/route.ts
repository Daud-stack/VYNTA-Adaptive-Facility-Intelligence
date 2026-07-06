export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { preferences: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const preferences = user.preferences ? JSON.parse(user.preferences) : {};
    return NextResponse.json(preferences);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { userId, ...preferences } = data;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.update({
      where: { id: userId },
      data: { preferences: JSON.stringify(preferences) }
    });

    return NextResponse.json({ success: true, preferences: JSON.parse(user.preferences || '{}') });
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
