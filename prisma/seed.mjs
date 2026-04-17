import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Vynta Database (Prisma 6 Stable)...');

  // Purge existing data
  await prisma.asset.deleteMany({});
  await prisma.ticket.deleteMany({});

  // Build some base data
  await prisma.asset.createMany({
    data: [
      { label: 'AST-101', name: 'Main Chiller A', type: 'HVAC', location: 'Section A1', health: 94, status: 'Active', uptime: '99.9%' },
      { label: 'AST-202', name: 'Server Rack 04', type: 'IT', location: 'Data Center', health: 82, status: 'Optimizing', uptime: '98.5%' },
      { label: 'AST-303', name: 'Elevator 02', type: 'Vertical Transport', location: 'Lobby', health: 65, status: 'Warning', uptime: '85.2%' },
      { label: 'AST-404', name: 'Backup Gen 01', type: 'Power', location: 'Utility Room', health: 98, status: 'Standby', uptime: '100%' },
    ]
  });

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
