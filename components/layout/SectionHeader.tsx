
import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => (
    <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-2">{title}</h2>
        {subtitle && <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
    </div>
);

export default SectionHeader;
