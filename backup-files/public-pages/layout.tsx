
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AIWidget from '@/components/layout/AIWidget';
import Breadcrumbs from '@/components/ui/Breadcrumbs';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
        <Header />
        <div className="container mx-auto px-4">
          <Breadcrumbs className="py-0" />
        </div>
        <main className="flex-1 -mt-2">{children}</main>
        <Footer />
        <AIWidget />
    </div>
  )
}
