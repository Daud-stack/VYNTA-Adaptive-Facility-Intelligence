'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import { VyntaProvider, useVynta } from "@/lib/store";

const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useVynta();
  const pathname = usePathname();
  const router = useRouter();
  
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoginPage, router]);

  if (!isAuthenticated && !isLoginPage) {
    return <div style={{ background: '#0d0d0d', height: '100vh' }} />;
  }

  return (
    <>
      {!isLoginPage && <Sidebar />}
      <main style={{ marginLeft: isLoginPage ? 0 : 'var(--sidebar-width)' }}>
        {children}
      </main>
    </>
  );
};

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <VyntaProvider>
      <ContentWrapper>
        {children}
      </ContentWrapper>
    </VyntaProvider>
  );
}
