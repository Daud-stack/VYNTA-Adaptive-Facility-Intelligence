import { mockAssets, mockEnergyTelemetry, mockTickets } from '@/lib/mockData';

type DemoUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  password: string;
};

type DemoTicket = {
  id: string;
  ticketId: string;
  title: string;
  user: string;
  priority: string;
  status: string;
  timestamp: string;
  aiResponse?: string;
  aiReasoning?: string;
  createdAt?: string;
};

const globalForDemoStore = globalThis as typeof globalThis & {
  __vyntaDemoStore?: {
    users: DemoUser[];
    assets: typeof mockAssets;
    tickets: DemoTicket[];
    energyTelemetry: typeof mockEnergyTelemetry;
    sensorMetrics: {
      temperature: number;
      co2: number;
      energy: number;
    };
  };
};

function createStore() {
  return {
    users: [
      {
        id: 'usr-admin',
        email: 'admin@vynta.ai',
        name: 'Vynta Admin',
        role: 'Admin',
        password: 'password123',
      },
      {
        id: 'usr-tenant',
        email: 'tenant@techcorp.com',
        name: 'Sarah Jenkins',
        role: 'Tenant',
        password: 'password123',
      },
    ],
    assets: mockAssets.map((asset) => ({
      ...asset,
      label: asset.id,
    })),
    tickets: mockTickets.map((ticket) => ({
      ...ticket,
      ticketId: ticket.id,
      id: `demo-${ticket.id}`,
      createdAt: new Date().toISOString(),
      aiReasoning:
        ticket.id === 'TKT-782'
          ? JSON.stringify([
              'Analyzing sensor logs...',
              'Correlating with historical incidents...',
            ])
          : undefined,
      aiResponse:
        ticket.id === 'TKT-782'
          ? 'I recommend checking the refrigerant levels. Consumption has spiked by 14%.'
          : undefined,
    })),
    energyTelemetry: [...mockEnergyTelemetry],
    sensorMetrics: {
      temperature: 21.4,
      co2: 450,
      energy: 140,
    },
  };
}

export function getDemoStore() {
  if (!globalForDemoStore.__vyntaDemoStore) {
    globalForDemoStore.__vyntaDemoStore = createStore();
  }

  return globalForDemoStore.__vyntaDemoStore;
}
