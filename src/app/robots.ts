import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://www.${process.env.NEXT_PUBLIC_FRONTEND || 'bkmower.com'}`

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/preview/',
          '/draft/',
          '/*.json$',
          '/wp-admin/',
          '/wp-login/',
          '/wp-content/plugins/',
          '/wp-includes/',
          '/author/',
          '/tag/',
          '/search/',
          '/page/',   // If you use pagination URLs that duplicate content
          '/404/',    // 404 page shouldn't be indexed
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/private/', '/members-only/'],
      },
      {
        userAgent: 'Googlebot-Image',
        allow: [
          '/*.jpg$',
          '/*.jpeg$',
          '/*.png$',
          '/*.gif$',
          '/*.webp$',
          '/*.svg$'
        ],
      },
      {
        // Add specific rules for social media crawlers
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
