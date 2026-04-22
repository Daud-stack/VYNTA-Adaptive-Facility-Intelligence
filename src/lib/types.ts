export type UserRole = 'Admin' | 'Tenant' | 'User';

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
};

export type Asset = {
  id: string;
  label?: string;
  name: string;
  type: string;
  location: string;
  health: number;
  status: string;
  uptime: string;
};

export type Ticket = {
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

export type SensorData = {
  occupancy: number;
  pue: number;
  energyUsage: number;
  activeAlerts: number;
};

export type EnergyPoint = {
  time: string;
  usage: number;
  pue?: number;
};
