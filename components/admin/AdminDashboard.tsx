
"use client";

import React, { useState, useEffect } from 'react';
import { useData } from '../../hooks/useContextHooks';
import { Loader2 } from '../../components/icons';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import StatCard from '../../components/admin/StatCard';
import ManageCollection from './ManageCollection';
import { collectionConfigs } from '../../lib/collectionConfig';
import { TableName } from '../../types';
import DatabaseFixWarning from '../../components/admin/DatabaseFixWarning';

const AdminDashboard: React.FC = () => {
    const data = useData();
    const { missingTables } = data;
    const [activeTab, setActiveTab] = useState<TableName>('doctors');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        // Prevent auto refresh when tab visibility changes
        const handleVisibilityChange = () => {
            // Do nothing when visibility changes
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    if (data.loading) {
        return <div className="flex h-screen w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    const getCollectionCount = (collectionName: TableName) => {
        return data[collectionName]?.length || 0;
    }
    
    const statCollections: TableName[] = ['doctors', 'services', 'facilities', 'articles'];

    return (
        <div className="min-h-screen w-full bg-gray-100 text-gray-800">
            <AdminSidebar 
                activeTab={activeTab} 
                setActiveTab={setActiveTab}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
            <div className="md:ml-64 flex flex-col flex-1">
                <AdminHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
                <main className="p-6 md:p-10">
                    {missingTables.length > 0 && (
                        <DatabaseFixWarning missingTables={missingTables} />
                    )}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {statCollections.map(name => (
                            <StatCard 
                                key={name}
                                title={`Total ${collectionConfigs[name].title}`}
                                value={getCollectionCount(name)} 
                                icon={collectionConfigs[name].icon} 
                            />
                        ))}
                    </div>
                    <div className="mt-8">
                        <ManageCollection collectionName={activeTab} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
