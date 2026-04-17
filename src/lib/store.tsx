'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SensorData {
  occupancy: number;
  pue: number;
  energyUsage: number;
  activeAlerts: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface VyntaContextType {
  sensors: SensorData;
  assets: any[];
  tickets: any[];
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshData: () => Promise<void>;
}

const VyntaContext = createContext<VyntaContextType | undefined>(undefined);

export const VyntaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [sensors, setSensors] = useState<SensorData>({
    occupancy: 642,
    pue: 1.42,
    energyUsage: 42.8,
    activeAlerts: 3
  });

  const refreshData = async () => {
    try {
      const [assetsRes, ticketsRes] = await Promise.all([
        fetch('/api/assets'),
        fetch('/api/tickets')
      ]);
      const assetsData = await assetsRes.json();
      const ticketsData = await ticketsRes.json();
      
      setAssets(Array.isArray(assetsData) ? assetsData : []);
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      
      // Update alerts based on tickets
      const openAlerts = Array.isArray(ticketsData) 
        ? ticketsData.filter((t: any) => t.priority === 'High' && t.status !== 'Completed').length 
        : 0;
      
      setSensors(prev => ({ ...prev, activeAlerts: openAlerts }));
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('vynta_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vynta_user');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('vynta_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <VyntaContext.Provider value={{
      sensors,
      assets,
      tickets,
      user,
      login,
      logout,
      isAuthenticated: !!user,
      refreshData
    }}>
      {children}
    </VyntaContext.Provider>
  );
};

export const useVynta = () => {
  const context = useContext(VyntaContext);
  if (!context) {
    throw new Error('useVynta must be used within a VyntaProvider');
  }
  return context;
};
