

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import DOMPurify from 'dompurify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateText = (text: string, maxLength: number): string => {
    if (!text || text.length <= maxLength) return text || '';
    return text.substring(0, maxLength).trim() + '...';
};

export const formatDate = (dateValue?: any): string => {
    if (!dateValue) return 'Invalid Date';
    try {
        // Cek apakah objek memiliki metode .toDate(), khas untuk Firebase Timestamps
        const date = dateValue.toDate ? dateValue.toDate() : new Date(dateValue);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch (e) {
        console.error("Error formatting date:", e);
        return 'Invalid Date';
    }
};

export const stripHtml = (html: string): string => {
    if (!html) return '';
    // Remove HTML tags using regex
    return html
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
        .replace(/&amp;/g, '&') // Replace &amp; with &
        .replace(/&lt;/g, '<') // Replace &lt; with <
        .replace(/&gt;/g, '>') // Replace &gt; with >
        .replace(/&quot;/g, '"') // Replace &quot; with "
        .replace(/&#39;/g, "'") // Replace &#39; with '
        .trim();
};

export const getPlainText = (html: string): string => {
    if (!html) return '';
    
    // Use stripHtml for both server and client side
    return stripHtml(html);

    // Fallback to DOM manipulation only on client side if needed
    if (typeof window !== 'undefined') {
        try {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = DOMPurify.sanitize(html);
            return tempDiv.textContent || tempDiv.innerText || '';
        } catch (e) {
            console.error('Error converting HTML to plain text:', e);
        }
    }
    
    return stripHtml(html);
};
