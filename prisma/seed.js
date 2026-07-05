const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const dbUrl = "postgresql://neondb_owner:npg_tWgV4DJp5lAK@ep-cool-water-ab6tdqbq-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting global database seed...');

  // 1. Wipe existing data for a clean slate
  console.log('🧹 Wiping existing data...');
  await prisma.cafeteriaOrder.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.travelRequest.deleteMany();
  await prisma.timesheet.deleteMany();
  await prisma.project.deleteMany();
  await prisma.payslip.deleteMany();
  await prisma.employeeProfile.deleteMany();
  await prisma.consignment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.maintenancePolicy.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.space.deleteMany();
  await prisma.visitor.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users (Admin, Tenant, Staff)
  console.log('👥 Seeding Users...');
  const admin = await prisma.user.create({
    data: { email: 'admin@vynta.ai', name: 'Vynta Admin', role: 'ADMIN', password: 'password123' }
  });
  const tenant = await prisma.user.create({
    data: { email: 'tenant@techcorp.com', name: 'Sarah Jenkins', role: 'USER', password: 'password123' }
  });
  const staff1 = await prisma.user.create({
    data: { email: 'mark@vynta.ai', name: 'Mark Engineer', role: 'USER', password: 'password123' }
  });
  const staff2 = await prisma.user.create({
    data: { email: 'chloe@vynta.ai', name: 'Chloe Designer', role: 'USER', password: 'password123' }
  });

  // 3. Seed HR Profiles & Payroll
  console.log('💼 Seeding HR & Payroll...');
  await prisma.employeeProfile.createMany({
    data: [
      { userId: staff1.id, department: 'Engineering', jobTitle: 'Senior Dev', hireDate: new Date('2022-01-15'), salary: 120000 },
      { userId: staff2.id, department: 'Design', jobTitle: 'UX Lead', hireDate: new Date('2023-06-01'), salary: 110000 }
    ]
  });

  await prisma.payslip.createMany({
    data: [
      { userId: staff1.id, periodStart: new Date('2024-05-01'), periodEnd: new Date('2024-05-31'), basicPay: 10000, deductions: 2500, netPay: 7500 },
      { userId: staff2.id, periodStart: new Date('2024-05-01'), periodEnd: new Date('2024-05-31'), basicPay: 9166, deductions: 2200, netPay: 6966 }
    ]
  });

  // 4. Seed Spaces & Bookings
  console.log('🏢 Seeding Spaces & Bookings...');
  const space1 = await prisma.space.create({
    data: { name: 'Boardroom Atlas', type: 'Conference Room', capacity: 12, amenities: '["Projector", "Whiteboard", "Video Call"]', status: 'Available' }
  });
  const space2 = await prisma.space.create({
    data: { name: 'Hot Desk Alpha', type: 'Hot Desk', capacity: 1, amenities: '["Monitor", "Ergo Chair"]', status: 'Available' }
  });

  await prisma.booking.create({
    data: { spaceId: space1.id, userId: tenant.id, startTime: new Date(Date.now() + 86400000), endTime: new Date(Date.now() + 93600000), status: 'CONFIRMED' }
  });

  // 5. Seed Mailroom & Billing
  console.log('📦 Seeding Mailroom & Billing...');
  await prisma.consignment.createMany({
    data: [
      { trackingNumber: 'FDX-99887766', carrier: 'FedEx', recipientId: tenant.id, status: 'RECEIVED' },
      { trackingNumber: 'UPS-11223344', carrier: 'UPS', recipientId: tenant.id, status: 'READY_FOR_PICKUP' }
    ]
  });

  await prisma.invoice.createMany({
    data: [
      { userId: tenant.id, amount: 4500.00, description: 'June Office Lease', dueDate: new Date(Date.now() + 10 * 86400000), status: 'PENDING' },
      { userId: tenant.id, amount: 350.00, description: 'Electricity Usage (May)', dueDate: new Date(Date.now() - 2 * 86400000), status: 'OVERDUE' }
    ]
  });

  // 6. Seed Cafeteria & Travel
  console.log('🍔 Seeding Cafeteria & Travel...');
  const menu1 = await prisma.menuItem.create({
    data: { name: 'Grilled Salmon Bowl', description: 'Fresh salmon with quinoa and greens.', price: 12.50, calories: 650, allergens: '["Fish"]', isAvailable: true }
  });
  const menu2 = await prisma.menuItem.create({
    data: { name: 'Vegan Burger', description: 'Beyond meat patty with sweet potato fries.', price: 9.00, calories: 800, allergens: '["Gluten"]', isAvailable: true }
  });

  await prisma.cafeteriaOrder.create({
    data: { userId: staff1.id, menuItemId: menu1.id, quantity: 1, status: 'PREPARING' }
  });

  await prisma.travelRequest.createMany({
    data: [
      { userId: staff2.id, destination: 'New York, NY', purpose: 'Q3 Design Summit', startDate: new Date('2024-09-10'), endDate: new Date('2024-09-14'), estimatedCost: 1850, status: 'PENDING' },
      { userId: staff1.id, destination: 'San Francisco, CA', purpose: 'Tech Conference', startDate: new Date('2024-08-01'), endDate: new Date('2024-08-05'), estimatedCost: 2100, status: 'APPROVED' }
    ]
  });

  // 7. Seed Visitors
  console.log('🧑‍🤝‍🧑 Seeding Visitors...');
  await prisma.visitor.create({
    data: { name: 'David Smith', email: 'david@client.com', company: 'Client Corp', hostId: tenant.id, purpose: 'Meeting', status: 'EXPECTED', expectedAt: new Date(Date.now() + 86400000) }
  });

  console.log('✨ Seeding Complete! Vynta is fully alive.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
