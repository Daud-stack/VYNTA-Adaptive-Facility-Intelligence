import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid Identity or Command Key' }, { status: 401 });
    }

    // Return user data (excluding password for safety)
    const { password: _, ...userData } = user;
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
