"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { translations } from '@/lib/translations';
import { cn } from '@/lib/utils';
import { ChevronRight } from '@/components/icons';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className }) => {
  const pathname = usePathname();
  const t = (key: string) => translations['id'][key] || key;

  // If no items provided, generate from pathname
  const breadcrumbItems = items || pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, array) => {
      const href = '/' + array.slice(0, index + 1).join('/');
      const label = t(segment.replace(/-/g, '')) || segment;
      return { href, label };
    });

  // Always include home
  const allItems = [
    { href: '/', label: 'Beranda' },
    ...breadcrumbItems
  ];

  return (
    <nav aria-label="breadcrumbs" className={cn("text-sm text-muted-foreground mb-4", className)}>
      <ol className="flex flex-wrap items-center" itemScope itemType="https://schema.org/BreadcrumbList">
        {allItems.map((item, index) => (
          <li 
            key={item.href}
            className="flex items-center"
            itemProp="itemListElement" 
            itemScope 
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4" />
            )}
            {index === allItems.length - 1 ? (
              <span className="font-medium text-foreground" itemProp="name">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors"
                itemProp="item"
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;