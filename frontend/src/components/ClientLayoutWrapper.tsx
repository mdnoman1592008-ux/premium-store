"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <Navbar />}
      <main style={{ flex: 1 }}>
        {children}
      </main>
      {!isAdminPath && <Footer />}
    </>
  );
}
