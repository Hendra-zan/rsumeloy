
"use client";

import React from 'react';
import { useAuth } from '../../hooks/useContextHooks';
import { Button } from '../ui/Button';
import { Menu } from '../icons';
import { Avatar, AvatarFallback } from '../ui/Avatar';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
    const { session } = useAuth();
    const userEmail = session?.user?.email;

    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg shadow-sm">
            <div className="flex items-center justify-between md:justify-end h-16 px-6">
                <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                    <Menu className="h-6 w-6" />
                </Button>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium hidden sm:block">
                        {userEmail || 'Admin'}
                    </span>
                    <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
