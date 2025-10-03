
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '../../hooks/useContextHooks';
import { cn } from '../../lib/utils';
import { navItemsConfig } from '../../lib/navigation';
import { Button } from '../ui/Button';
import { Menu, X, ChevronDown } from '../icons';
import TopBar from './TopBar';
import OptimizedImage from '../ui/OptimizedImage';

interface NavItem {
    id: string;
    path: string;
    labelKey: string;
    submenu?: {
        id: string;
        path: string;
        labelKey: string;
        subtitleKey?: string;
    }[];
}

const Header: React.FC = () => {
    const { t } = useLanguage();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    useEffect(() => {
        setMobileMenuOpen(false);
        setOpenDropdown(null);
        setOpenMobileDropdown(null);
    }, [pathname]);

    const handleNavigate = (path: string) => {
        router.push(path);
    };

    const handleMobileDropdownToggle = (itemId: string) => {
        setOpenMobileDropdown(prev => (prev === itemId ? null : itemId));
    };

    const navItems = navItemsConfig.map(item => ({
        ...item,
        label: t(item.labelKey),
        submenu: item.submenu?.map(sub => ({ 
            ...sub, 
            label: t(sub.labelKey), 
            subtitle: sub.subtitleKey ? t(sub.subtitleKey) : undefined 
        }))
    }));

    return (
        <>
            <header className={cn(
                "fixed top-0 z-40 w-full transition-all duration-300",
                isScrolled ? 'glass glass--primary' : 'bg-transparent'
            )}>
                <TopBar isScrolled={isScrolled} />
                <div className="container mx-auto px-4 md:px-6 flex h-20 items-center justify-between">
                    <Link href="/" className="flex items-center gap-1.5 md:gap-3 cursor-pointer">
                        <OptimizedImage publicId="logo_rsmeloy_web" alt="Logo RSU Meloy" width={40} height={40} className="object-contain" />
                        <span className={cn(
                            "font-bold text-base md:text-xl transition-colors",
                            isScrolled ? "text-foreground" : "text-white"
                        )}>
                            RSU Meloy
                        </span>
                    </Link>
                    
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map((item) => {
                            const isActive = item.path === '/' 
                                ? pathname === '/' 
                                : pathname.startsWith(`/${item.path.split('/')[1]}`);
                            
                            return (
                                <div
                                    key={item.id}
                                    className="relative"
                                    onMouseEnter={() => item.submenu && setOpenDropdown(item.id)}
                                    onMouseLeave={() => item.submenu && setOpenDropdown(null)}
                                >
                                    <Link
                                        href={item.path}
                                        className={cn(
                                            "flex items-center gap-1 font-medium transition-colors",
                                            isScrolled
                                                ? (isActive ? 'text-primary font-bold' : 'text-foreground hover:text-primary')
                                                : (isActive ? 'text-white font-bold' : 'text-gray-200 hover:text-white')
                                        )}
                                    >
                                        {item.label}
                                        {item.submenu && (
                                            <ChevronDown 
                                                className={cn(
                                                    'h-4 w-4 transition-transform',
                                                    openDropdown === item.id && 'rotate-180'
                                                )} 
                                            />
                                        )}
                                    </Link>
                                    
                                    {item.submenu && openDropdown === item.id && (
                                        <div className="absolute top-full pt-2 -left-4 w-56 animate-fade-in">
                                            <div className="bg-background border rounded-md shadow-lg py-1">
                                                {item.submenu.map(subItem => (
                                                    <button 
                                                        key={subItem.id} 
                                                        onClick={() => handleNavigate(subItem.path)} 
                                                        className="w-full text-left block px-4 py-2 text-sm text-foreground hover:bg-accent cursor-pointer"
                                                    >
                                                        {subItem.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                    
                    <div className="md:hidden">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setMobileMenuOpen(true)} 
                            className={cn(
                                "transition-colors",
                                !isScrolled && "text-white hover:text-white hover:bg-white/20"
                            )}
                        >
                            <Menu />
                        </Button>
                    </div>
                </div>
            </header>
            
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 z-50 bg-black/80 md:hidden" 
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <div 
                        className="fixed inset-y-0 right-0 z-50 w-3/4 max-w-sm p-0 glass" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center p-4 border-b">
                                <h2 className="font-bold text-foreground">Menu</h2>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <X />
                                </Button>
                            </div>
                            <nav className="flex-1 overflow-y-auto p-2">
                                {navItems.map((item) => (
                                    <div key={item.id} className="border-b last:border-b-0">
                                        {item.submenu ? (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    className="w-full flex justify-between items-center font-semibold py-3 text-base text-foreground"
                                                    onClick={() => handleMobileDropdownToggle(item.id)}
                                                >
                                                    <span>{item.label}</span>
                                                    <ChevronDown 
                                                        className={cn(
                                                            'h-5 w-5 transition-transform',
                                                            openMobileDropdown === item.id && 'rotate-180'
                                                        )} 
                                                    />
                                                </Button>
                                                {openMobileDropdown === item.id && (
                                                    <div className="overflow-hidden animate-accordion-down">
                                                        <div className="pl-4 pt-1 pb-2 space-y-1">
                                                            {item.submenu.map(subItem => (
                                                                <Button
                                                                    key={subItem.id}
                                                                    variant="ghost"
                                                                    className="w-full justify-start text-foreground/80 font-normal"
                                                                    onClick={() => handleNavigate(subItem.path)}
                                                                >
                                                                    {subItem.label}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start font-semibold py-3 text-base text-foreground"
                                                onClick={() => handleNavigate(item.path)}
                                            >
                                                {item.label}
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
