export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employeeProfile.findMany({
      include: {
        user: { select: { name: true, email: true, role: true } }
      },
      orderBy: { department: 'asc' }
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch HR data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, department, jobTitle, salary, hireDate } = body;

    // Create user and employee profile in a transaction
    const newEmployee = await prisma.$transaction(async (tx) => {
      // 1. Create the user
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: 'password123', // Default password
          role: 'USER'
        }
      });

      // 2. Create the employee profile
      const profile = await tx.employeeProfile.create({
        data: {
          userId: user.id,
          department,
          jobTitle,
          salary: parseFloat(salary),
          hireDate: new Date(hireDate)
        },
        include: {
          user: { select: { name: true, email: true, role: true } }
        }
      });

      return profile;
    });

    return NextResponse.json(newEmployee);
  } catch (error: any) {
    console.error('Error adding employee:', error);
    return NextResponse.json({ error: 'Failed to add employee', details: error.message }, { status: 500 });
  }
}
