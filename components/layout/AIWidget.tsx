
"use client";

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Bot, X } from '../icons';
import AIHealthAssistant from '../../app/(public)/konsultasi/components/AIHealthAssistant';
import Tooltip from '../ui/Tooltip';
import { useLanguage } from '../../hooks/useContextHooks';
import { cn } from '../../lib/utils';

const AIWidget: React.FC = () => {
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <Tooltip content={!isOpen ? t('asistenAI') : null}>
                    <Button
                        size="icon"
                        className="h-16 w-16 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:scale-110"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label={t('asistenAI')}
                        aria-expanded={isOpen}
                    >
                        <div className="relative h-8 w-8">
                            <Bot className={cn("absolute inset-0 transition-all duration-300", isOpen ? 'transform rotate-45 opacity-0' : 'transform rotate-0 opacity-100')} />
                            <X className={cn("absolute inset-0 transition-all duration-300", isOpen ? 'transform rotate-0 opacity-100' : 'transform -rotate-45 opacity-0')} />
                        </div>
                    </Button>
                </Tooltip>
            </div>
            
            <div className={cn(
                "fixed bottom-28 right-4 z-50 transition-all duration-300 ease-out",
                "w-[calc(100vw-2rem)] max-w-sm sm:max-w-md md:max-w-lg",
                "h-[calc(100vh-8rem)] max-h-[600px] min-h-[400px]",
                "flex flex-col rounded-xl overflow-hidden shadow-2xl",
                isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95 pointer-events-none"
            )}>
                 <AIHealthAssistant onClose={() => setIsOpen(false)} />
            </div>
        </>
    );
};

export default AIWidget;
