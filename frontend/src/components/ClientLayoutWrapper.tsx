"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');
  const isCheckoutPath = pathname?.startsWith('/checkout');

  return (
    <>
      {!isAdminPath && !isCheckoutPath && <Navbar />}
      <main style={{ flex: 1 }}>
        {children}
      </main>
      {!isAdminPath && !isCheckoutPath && (
        <>
          <Footer />
          <MobileBottomNav />
        </>
      )}
    </>
  );
}
