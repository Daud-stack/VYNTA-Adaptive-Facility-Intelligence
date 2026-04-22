'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { readJsonResponse } from '@/lib/http';
import type { Asset, SensorData, Ticket, User } from '@/lib/types';

interface VyntaContextType {
  sensors: SensorData;
  assets: Asset[];
  tickets: Ticket[];
  user: User | null;
  isHydrated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  refreshData: () => Promise<void>;
}

const VyntaContext = createContext<VyntaContextType | undefined>(undefined);

export const VyntaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
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
      const [assetsData, ticketsData] = await Promise.all([
        readJsonResponse<Asset[]>(assetsRes),
        readJsonResponse<Ticket[]>(ticketsRes)
      ]);
      
      setAssets(Array.isArray(assetsData) ? assetsData : []);
      setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      
      // Update alerts based on tickets
      const openAlerts = Array.isArray(ticketsData) 
        ? ticketsData.filter((ticket) => ticket.priority === 'High' && ticket.status !== 'Completed').length 
        : 0;
      
      setSensors(prev => ({ ...prev, activeAlerts: openAlerts }));
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const savedUser = window.localStorage.getItem('vynta_user');

      if (savedUser) {
        setUser(JSON.parse(savedUser) as User);
      }

      setIsHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const loadData = () => {
      void refreshData();
    };

    const timeoutId = window.setTimeout(loadData, 0);
    const interval = window.setInterval(loadData, 30000); // Polling every 30s
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(interval);
    };
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('vynta_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('vynta_user');
  };
  return (
    <VyntaContext.Provider value={{
      sensors,
      assets,
      tickets,
      user,
      isHydrated,
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
