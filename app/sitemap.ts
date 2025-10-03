
import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { navItemsConfig } from '@/lib/navigation';

interface DatabaseItem {
  slug?: string;
  id?: string;
  created_at: string;
}

interface NavItem {
  url: string;
  submenu?: { url: string }[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rsumeloy.com';
  const supabase = createClient();

  // Fetch dynamic routes
  const { data: services } = await supabase.from('services').select('slug, created_at') as { data: DatabaseItem[] };
  const { data: facilities } = await supabase.from('facilities').select('slug, created_at') as { data: DatabaseItem[] };
  const { data: articles } = await supabase.from('articles').select('slug, created_at') as { data: DatabaseItem[] };
  const { data: info } = await supabase.from('info').select('id, created_at') as { data: DatabaseItem[] };

  const serviceUrls = services?.map(({ slug, created_at }) => ({
    url: `${siteUrl}/layanan/${slug}`,
    lastModified: new Date(created_at),
    changeFrequency: 'weekly',
    priority: 0.8
  })) ?? [];

  const facilityUrls = facilities?.map(({ slug, created_at }) => ({
    url: `${siteUrl}/fasilitas/${slug}`,
    lastModified: new Date(created_at),
    changeFrequency: 'monthly',
    priority: 0.7
  })) ?? [];
  
  const articleUrls = articles?.map(({ slug, created_at }) => ({
    url: `${siteUrl}/tentang/artikel/${slug}`,
    lastModified: new Date(created_at),
    changeFrequency: 'monthly',
    priority: 0.6
  })) ?? [];
  
  const infoUrls = info?.map(({ id, created_at }) => ({
    url: `${siteUrl}/info/${id}`,
    lastModified: new Date(created_at),
  })) ?? [];

  // Static routes from navigation config
  const staticUrls = navItemsConfig.flatMap(item => {
    const mainRoute = { url: `${siteUrl}${item.path}`, lastModified: new Date() };
    const subRoutes = item.submenu?.map(sub => ({
      url: `${siteUrl}${sub.path}`,
      lastModified: new Date(),
    })) ?? [];
    return [mainRoute, ...subRoutes];
  });
  
  // Remove duplicates
  const uniqueUrls = Array.from(new Map(staticUrls.map(item => [item.url, item])).values());

  return [
    { url: siteUrl, lastModified: new Date() },
    ...uniqueUrls,
    ...serviceUrls,
    ...facilityUrls,
    ...articleUrls,
    ...infoUrls,
  ]
}
