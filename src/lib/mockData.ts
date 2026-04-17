export const mockAssets = [
  { id: 'AST-101', name: 'Main Chiller A', type: 'HVAC', location: 'Section A1', health: 94, status: 'Active', uptime: '99.9%' },
  { id: 'AST-202', name: 'Server Rack 04', type: 'IT', location: 'Data Center', health: 82, status: 'Optimizing', uptime: '98.5%' },
  { id: 'AST-303', name: 'Elevator 02', type: 'Vertical Transport', location: 'Lobby', health: 65, status: 'Warning', uptime: '85.2%' },
  { id: 'AST-404', name: 'Backup Gen 01', type: 'Power', location: 'Utility Room', health: 98, status: 'Standby', uptime: '100%' },
];

export const mockTickets = [
  { id: 'TKT-782', title: 'Temperature fluctuation in North Wing', user: 'Sarah Jenkins', priority: 'High', status: 'In Progress', timestamp: '10m ago' },
  { id: 'TKT-901', title: 'Lighting sensor failure', user: 'James Chen', priority: 'Medium', status: 'Unassigned', timestamp: '45m ago' },
  { id: 'TKT-554', title: 'Scheduled filter replacement', user: 'System Auto', priority: 'Low', status: 'Completed', timestamp: '2h ago' },
];

export const mockEnergyTelemetry = [
  { time: '00:00', usage: 120, pue: 1.25 },
  { time: '04:00', usage: 110, pue: 1.22 },
  { time: '08:00', usage: 180, pue: 1.45 },
  { time: '12:00', usage: 220, pue: 1.55 },
  { time: '16:00', usage: 210, pue: 1.50 },
  { time: '20:00', usage: 160, pue: 1.35 },
  { time: '23:59', usage: 130, pue: 1.28 },
];
