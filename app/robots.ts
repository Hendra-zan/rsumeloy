
import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rsumeloy.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/login/',
          '/*?*', // Block URLs with query parameters
          '/api/', // Block API routes
          '/_next/', // Block Next.js system files
          '/static/images/loading.gif',
        ],
        crawlDelay: 10,
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/'], // Block GPT crawler
      }
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
