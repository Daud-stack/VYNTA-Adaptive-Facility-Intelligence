import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demoStore';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
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

    const fallbackUser = getDemoStore().users.find(
      (user) => user.email === email && user.password === password
    );

    if (!fallbackUser) {
      return NextResponse.json({ error: 'Invalid Identity or Command Key' }, { status: 401 });
    }

    const { password: _, ...userData } = fallbackUser;
    return NextResponse.json(userData);
  }
}
