
import 'server-only';
import { createClient } from './supabase/server';
import { cache } from 'react';
import { fallbackServices, fallbackFacilities, fallbackInfoItems, fallbackArticles } from '../data/fallbackData';

// Deteksi apakah kode berjalan saat build time di Vercel
const isVercelBuild = process.env.VERCEL_ENV === 'production' && process.env.NEXT_PHASE === 'build';

export const getDoctors = cache(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false });
    if (error) {
        console.error('Error fetching doctors:', error.message);
        return [];
    }
    return data;
});

export const getServices = cache(async () => {
    // Gunakan data fallback saat build time di Vercel
    if (isVercelBuild) {
        console.log('Using fallback services data during build');
        return fallbackServices;
    }
    
    try {
        const supabase = createClient();
        const { data, error } = await supabase.from('services').select('*');
        if (error) {
            console.error('Error fetching services:', error.message);
            return fallbackServices;
        }
        return data;
    } catch (error) {
        console.error('Error fetching services:', error);
        return fallbackServices;
    }
});

export const getServiceBySlug = cache(async (slug: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('services').select('*').eq('slug', slug).single();
    if (error) {
        console.error(`Error fetching service by slug ${slug}:`, error.message);
        return null;
    }
    return data;
});


export const getFacilities = cache(async () => {
    // Gunakan data fallback saat build time di Vercel
    if (isVercelBuild) {
        console.log('Using fallback facilities data during build');
        return fallbackFacilities;
    }
    
    try {
        const supabase = createClient();
        const { data, error } = await supabase.from('facilities').select('*');
        if (error) {
            console.error('Error fetching facilities:', error.message);
            return fallbackFacilities;
        }
        return data;
    } catch (error) {
        console.error('Error fetching facilities:', error);
        return fallbackFacilities;
    }
});

export const getFacilityBySlug = cache(async (slug: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('facilities').select('*').eq('slug', slug).single();
    if (error) {
        console.error(`Error fetching facility by slug ${slug}:`, error.message);
        return null;
    }
    return data;
});

export const getArticleBySlug = cache(async (slug: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).single();
    if (error) {
        console.error(`Error fetching article by slug ${slug}:`, error.message);
        return null;
    }
    return data;
});

export const getInfoItems = cache(async () => {
    // Redirect to getInfo() untuk konsistensi
    return getInfo();
});

export const getVacancies = cache(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('vacancies').select('*').order('deadline', { ascending: true });
    if (error) {
        console.error('Error fetching vacancies:', error.message);
        return [];
    }
    return data;
});

export const getInfo = cache(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.from('info_items').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error('Error fetching info:', error.message);
        return [];
    }
    return data;
});

export const getInfoItemById = cache(async (id: string) => {
    // Gunakan data fallback saat build time di Vercel
    if (isVercelBuild) {
        console.log('Using fallback info data during build');
        const fallbackItem = fallbackInfoItems.find(item => item.id === id);
        return fallbackItem || null;
    }

    const supabase = createClient();
    const { data, error } = await supabase.from('info').select('*').eq('id', id).single();
    if (error) {
        console.error(`Error fetching info by id ${id}:`, error.message);
        return null;
    }
    return data;
});

export const getArticles = cache(async () => {
    // Gunakan data fallback saat build time di Vercel
    if (isVercelBuild) {
        console.log('Using fallback articles data during build');
        return fallbackArticles;
    }
    
    try {
        const supabase = createClient();
        const { data, error } = await supabase.from('articles').select('*');
        if (error) {
            console.error('Error fetching articles:', error.message);
            return fallbackArticles;
        }
        return data;
    } catch (error) {
        console.error('Error fetching articles:', error);
        return fallbackArticles;
    }
});

export const getPartners = cache(async () => {
    // Gunakan data fallback kosong saat build time di Vercel
    if (isVercelBuild) {
        console.log('Using empty partners data during build');
        return [];
    }
    
    try {
        const supabase = createClient();
        const { data, error } = await supabase.from('partners').select('*');
        if (error) {
            console.error('Error fetching partners:', error.message);
            return [];
        }
        return data;
    } catch (error) {
        console.error('Error fetching partners:', error);
        return [];
    }
});

export const getAIAssistantConfig = cache(async () => {
    try {
        const supabase = createClient();
        const { data, error } = await supabase.from('ai_config').select('*').single();
        if (error) {
            console.error('Error fetching AI assistant config:', error.message);
            return { enabled: true, system_instruction: '' };
        }
        return data;
    } catch (error) {
        console.error('Error fetching AI assistant config:', error);
        return { enabled: true, system_instruction: '' };
    }
});
