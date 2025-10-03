
"use client";

import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
    const [visible, setVisible] = useState(false);
    return (
        <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            {children}
            {visible && content && (
                <div className="animate-fade-in absolute z-10 w-max max-w-xs px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm bottom-full left-1/2 -translate-x-1/2 mb-2">
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
