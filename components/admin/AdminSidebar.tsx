
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useContextHooks';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import { collectionConfigs } from '../../lib/collectionConfig';
import { ArrowLeft, LogOut } from '../icons';
import { TableName } from '../../types';
import OptimizedImage from '../ui/OptimizedImage';
import Link from 'next/link';

interface AdminSidebarProps {
    activeTab: TableName;
    setActiveTab: (tab: TableName) => void;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
    const router = useRouter();
    const { logout } = useAuth();
    
    const tabs = Object.entries(collectionConfigs).map(([id, config]) => ({
        id: id as TableName,
        label: config.title,
        icon: config.icon,
    }));

    return (
        <>
            <aside className={cn(
                "bg-white border-r border-gray-200 flex flex-col z-40 transition-transform duration-300 ease-in-out",
                "fixed inset-y-0 left-0 w-64 transform",
                "md:translate-x-0",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center gap-3 p-4 h-16 flex-shrink-0 border-b">
                    <div className="bg-primary p-1 rounded-full">
                        <OptimizedImage publicId="logo_rsmeloy_web" alt="Logo RSU Meloy" width={24} height={24} className="object-contain" />
                    </div>
                    <h2 className="text-lg font-bold whitespace-nowrap text-gray-800">Admin Panel</h2>
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto p-2">
                    {tabs.map(tab => (
                        <Button 
                            key={tab.id} 
                            variant={activeTab === tab.id ? 'secondary' : 'ghost'} 
                            className="w-full justify-start text-left" 
                            onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}
                        >
                            <tab.icon className="h-5 w-5 mr-3 flex-shrink-0 text-muted-foreground" />
                            <span className="whitespace-nowrap">{tab.label}</span>
                        </Button>
                    ))}
                </nav>
                <div className="mt-auto space-y-1 p-2 border-t flex-shrink-0">
                    <Button variant="ghost" className="w-full justify-start text-left" asChild>
                        <Link href="/">
                            <ArrowLeft className="h-5 w-5 mr-3 flex-shrink-0" />
                            <span className="ml-3 whitespace-nowrap">Kembali ke Situs</span>
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-left text-destructive hover:bg-red-50 hover:text-destructive" onClick={logout}>
                        <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
                        <span className="ml-3 whitespace-nowrap">Logout</span>
                    </Button>
                </div>
            </aside>
            {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}
        </>
    );
};

export default AdminSidebar;
