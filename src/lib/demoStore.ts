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

export type DemoTenantRequest = {
  id: string;
  requestId: string;
  category: 'Space Booking' | 'Access Key' | 'Catering';
  title: string;
  requester: string;
  details: string;
  status: string;
  timestamp: string;
  meta?: Record<string, string>;
  createdAt?: string;
};

type DemoStore = {
  users: DemoUser[];
  assets: (typeof mockAssets[number] & { label: string })[];
  tickets: DemoTicket[];
  tenantRequests: DemoTenantRequest[];
  energyTelemetry: typeof mockEnergyTelemetry;
  sensorMetrics: {
    temperature: number;
    co2: number;
    energy: number;
  };
};

const globalForDemoStore = globalThis as typeof globalThis & {
  __vyntaDemoStore?: DemoStore;
};

function createStore(): DemoStore {
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
    tenantRequests: [
      {
        id: 'req-booking-1',
        requestId: 'REQ-2401',
        category: 'Space Booking',
        title: 'Boardroom Atlas reservation',
        requester: 'Sarah Jenkins',
        details: 'Need a 12-seat room with video conferencing for a client briefing.',
        status: 'Confirmed',
        timestamp: 'Today, 14:00',
        meta: {
          date: 'Today',
          time: '14:00 - 15:30',
          attendees: '12',
        },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'req-catering-1',
        requestId: 'REQ-2402',
        category: 'Catering',
        title: 'Coffee and pastry drop',
        requester: 'Sarah Jenkins',
        details: 'Refreshments for the Level 4 morning standup.',
        status: 'Preparing',
        timestamp: 'Tomorrow, 08:30',
        meta: {
          delivery: 'Tomorrow 08:30',
          servings: '8',
          preference: 'Vegetarian mix',
        },
        createdAt: new Date().toISOString(),
      },
    ],
    energyTelemetry: [...mockEnergyTelemetry],
    sensorMetrics: {
      temperature: 21.4,
      co2: 450,
      energy: 140,
    },
  };
}

export function getDemoStore(): DemoStore {
  if (!globalForDemoStore.__vyntaDemoStore) {
    globalForDemoStore.__vyntaDemoStore = createStore();
  }

  return globalForDemoStore.__vyntaDemoStore;
}
