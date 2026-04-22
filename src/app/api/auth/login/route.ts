import { NextResponse } from 'next/server';
import { getDemoStore } from '@/lib/demoStore';
import { getPrismaClient } from '@/lib/prisma';

function toSafeUser(user: { id: string; email: string; name: string; role: string }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid Identity or Command Key' }, { status: 401 });
    }

    return NextResponse.json(toSafeUser(user));
  } catch (error) {
    console.error('Login error:', error);

    const fallbackUser = getDemoStore().users.find(
      (user) => user.email === email && user.password === password
    );

    if (!fallbackUser) {
      return NextResponse.json({ error: 'Invalid Identity or Command Key' }, { status: 401 });
    }

    return NextResponse.json(toSafeUser(fallbackUser));
  }
}
