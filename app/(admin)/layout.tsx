"use client";

import React from 'react';
import { DataProvider } from '../../contexts/DataContext';

// This layout is for admin-related pages like login and the dashboard itself.
// It doesn't include the public Header and Footer.
// It is now a client component to support the DataProvider context.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DataProvider>
      <div className="flex min-h-screen flex-col">
          {children}
      </div>
    </DataProvider>
  )
}