import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://www.${process.env.NEXT_PUBLIC_FRONTEND || 'bkmower.com'}`

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/post/',
          '/category/',
          '/*.jpg$',
          '/*.jpeg$',
          '/*.png$',
          '/*.gif$',
          '/*.webp$',
          '/*.svg$'
        ],
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
          '/page/',
          '/404/',
          '/my-account/',
          '/cart/',
          '/checkout/',
          '/wp-content/uploads/*.php$',
          '/wp-content/uploads/*.js$',
          '/wp-content/uploads/*.css$',
          '/wp-content/uploads/*.txt$',
          '/wp-content/uploads/*.xml$',
          '/wp-content/uploads/*.json$',
          '/wp-content/uploads/*.sql$',
          '/wp-content/uploads/*.log$',
          '/wp-content/uploads/*.bak$',
          '/wp-content/uploads/*.old$',
          '/wp-content/uploads/*.tmp$',
          '/wp-content/uploads/*.temp$',
          '/wp-content/uploads/*.swp$',
          '/wp-content/uploads/*.swo$',
          '/wp-content/uploads/*.swn$'
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
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/author/',
          '/tag/',
          '/search/',
          '/page/',
          '/404/',
          '/my-account/',
          '/cart/',
          '/checkout/'
        ],
      },
      {
        userAgent: 'Yandex',
        allow: '/',
        disallow: [
          '/author/',
          '/tag/',
          '/search/',
          '/page/',
          '/404/',
          '/my-account/',
          '/cart/',
          '/checkout/'
        ],
      }
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/post-sitemap.xml`,
      `${baseUrl}/page-sitemap.xml`,
      `${baseUrl}/category-sitemap.xml`,
      `${baseUrl}/image-sitemap.xml`
    ],
    host: baseUrl,
  }
}
