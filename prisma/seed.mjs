import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Vynta Database (Prisma 6 Stable)...');

  await prisma.user.deleteMany({});
  await prisma.sensorLog.deleteMany({});
  await prisma.asset.deleteMany({});
  await prisma.ticket.deleteMany({});

  // Users
  await prisma.user.createMany({
    data: [
      { email: 'admin@vynta.ai', name: 'Vynta Admin', role: 'Admin', password: 'password123' },
      { email: 'tenant@techcorp.com', name: 'Sarah Sarah', role: 'Tenant', password: 'password123' },
    ]
  });

  // Assets
  await prisma.asset.createMany({
    data: [
      { label: 'AST-101', name: 'Main Chiller A', type: 'HVAC', location: 'Section A1', health: 94, status: 'Active', uptime: '99.9%' },
      { label: 'AST-202', name: 'Server Rack 04', type: 'IT', location: 'Data Center', health: 82, status: 'Optimizing', uptime: '98.5%' },
      { label: 'AST-303', name: 'Elevator 02', type: 'Vertical Transport', location: 'Lobby', health: 65, status: 'Warning', uptime: '85.2%' },
      { label: 'AST-404', name: 'Backup Gen 01', type: 'Power', location: 'Utility Room', health: 98, status: 'Standby', uptime: '100%' },
    ]
  });

  // Tickets
  await prisma.ticket.createMany({
    data: [
      { 
        ticketId: 'TKT-782', 
        title: 'Temperature fluctuation in North Wing', 
        user: 'Sarah Jenkins', 
        priority: 'High', 
        status: 'In Progress', 
        timestamp: '10m ago',
        aiResponse: 'I recommend checking the refrigerant levels. Consumption has spiked by 14%.',
        aiReasoning: JSON.stringify(["Analyzing sensor logs...", "Correlating with historical incidents..."])
      },
      { 
        ticketId: 'TKT-901', 
        title: 'Lighting sensor failure', 
        user: 'James Chen', 
        priority: 'Medium', 
        status: 'Unassigned', 
        timestamp: '45m ago' 
      },
    ]
  });

  // Sensor Logs (Simulated Historical Data)
  const sensors = [];
  for (let i = 0; i < 24; i++) {
    const time = new Date();
    time.setHours(time.getHours() - i);
    sensors.push(
      { type: 'Energy', value: 120 + Math.random() * 80, unit: 'kWh', timestamp: time },
      { type: 'Temperature', value: 21 + Math.random() * 4, unit: '°C', timestamp: time },
      { type: 'CO2', value: 400 + Math.random() * 200, unit: 'ppm', timestamp: time }
    );
  }
  await prisma.sensorLog.createMany({ data: sensors });

  console.log('✅ Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
