
"use client";

import React, { useState } from 'react';
import { useLanguage } from '../../hooks/useContextHooks';
import { Mail, Phone, WhatsAppIcon } from '../icons';
import { cn } from '../../lib/utils';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    return (
        <div className="flex items-center rounded-full border border-current/50 p-0.5 text-xs">
            <button onClick={() => setLanguage('id')} className={`rounded-full px-2 py-0.5 transition-colors ${language === 'id' ? 'bg-white text-primary' : 'hover:bg-white/10'}`}>ID</button>
            <button onClick={() => setLanguage('en')} className={`rounded-full px-2 py-0.5 transition-colors ${language === 'en' ? 'bg-white text-primary' : 'hover:bg-white/10'}`}>EN</button>
        </div>
    );
};

interface TopBarProps {
    isScrolled: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ isScrolled }) => {
    const { t } = useLanguage();
    const waUrl = `https://wa.me/628115495477?text=${encodeURIComponent(t('waRegistration'))}`;
    const emailAddress = 'rsu_meloy@yahoo.co.id';
    const [emailText, setEmailText] = useState(emailAddress);

    const handleEmailClick = () => {
        navigator.clipboard.writeText(emailAddress);
        setEmailText('Email disalin!');
        setTimeout(() => {
            setEmailText(emailAddress);
        }, 2000);
    };

    return (
        <div className={cn(
            "bg-primary text-xs text-white transition-all duration-300 overflow-hidden",
            isScrolled ? "h-0 opacity-0" : "h-9 opacity-100"
        )}>
            <div className="container mx-auto flex h-9 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-6">
                    <a href={`mailto:${emailAddress}`} onClick={handleEmailClick} className="flex items-center gap-2 hover:text-gray-200 transition-colors">
                        <Mail className="h-4 w-4" />
                        <span className="hidden md:inline">{emailText}</span>
                    </a>
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hidden sm:flex items-center gap-2 hover:text-gray-200 transition-colors">
                        <WhatsAppIcon className="h-4 w-4" />
                        <span>{t('waDaftar')}</span>
                    </a>
                </div>
                <div className="flex items-center gap-4">
                    <a href="tel:054924222" className="inline-flex items-center gap-2 text-xs h-7 px-3 rounded-full border border-current/50 bg-white/10 hover:bg-white/20 transition-colors">
                        <Phone className="h-3 w-3" />
                        <span>{t('kontakDarurat')}: (0549) 24222</span>
                    </a>
                    <LanguageSwitcher />
                </div>
            </div>
        </div>
    );
};

export default TopBar;
