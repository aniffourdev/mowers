// app/sitemap.ts
import { MetadataRoute } from 'next'
import { client } from '@/api/graphql/client'
import { gql } from 'graphql-request'
import { getContentBySlug } from "@/api/graphql/content/content"

// Interfaces for sitemap data
interface SitemapPost {
  slug: string
  seo: {
    opengraphModifiedTime: string
    canonical?: string
  }
  featuredImage?: {
    node: {
      sourceUrl: string
      altText?: string
      title?: string
    }
  }
}

interface AllPostsResult {
  posts: {
    nodes: SitemapPost[]
  }
}

interface AllCategoriesResult {
  categories: {
    nodes: {
      slug: string
    }[]
  }
}

interface AllPagesResult {
  pages: {
    nodes: {
      slug: string
      modified: string
    }[]
  }
}

// GraphQL query to get all published posts with featured images for sitemap
const GET_ALL_POSTS_FOR_SITEMAP = gql`
  query GetAllPostsForSitemap {
    posts(first: 1000, where: { status: PUBLISH }) {
      nodes {
        slug
        seo {
          opengraphModifiedTime
          canonical
        }
        featuredImage {
          node {
            sourceUrl
            altText
            title
          }
        }
      }
    }
  }
`

const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    categories(first: 100) {
      nodes {
        slug
      }
    }
  }
`

const GET_ALL_PAGES = gql`
  query GetAllPages {
    pages(first: 50, where: { status: PUBLISH }) {
      nodes {
        slug
        modified
      }
    }
  }
`

// Helper function to ensure URLs are on the same domain
function ensureSameDomain(url: string, baseUrl: string): string {
  try {
    const urlObj = new URL(url)
    const baseUrlObj = new URL(baseUrl)
    if (urlObj.hostname !== baseUrlObj.hostname) {
      return `${baseUrl}${urlObj.pathname}`
    }
    return url
  } catch {
    return url
  }
}

// Helper function to filter out non-SEO URLs
function isSeoUrl(slug: string): boolean {
  const nonSeoPaths = [
    'my-account',
    'cart',
    'checkout',
    'wp-admin',
    'wp-login',
    'wp-content',
    'wp-includes',
    'api',
    'dashboard',
    'preview',
    'draft'
  ]
  return !nonSeoPaths.some(path => slug.includes(path))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://www.${process.env.NEXT_PUBLIC_FRONTEND || 'bkmower.com'}`
  const sitemapEntries: MetadataRoute.Sitemap = []

  // Add static pages first (only SEO-relevant ones)
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }
  ]

  sitemapEntries.push(...staticPages)

  // Fetch and add all posts
  try {
    const postData = await client.request<AllPostsResult>(GET_ALL_POSTS_FOR_SITEMAP)
    const postUrls = postData.posts.nodes
      .filter(post => isSeoUrl(post.slug))
      .map((post) => {
        // Transform slashes if needed (ensuring consistent URL format)
        const slug = post.slug.endsWith('/') ? post.slug.slice(0, -1) : post.slug
        const lastModified = post.seo.opengraphModifiedTime ? new Date(post.seo.opengraphModifiedTime) : new Date()
        
        // Calculate priority based on post age (newer posts get higher priority)
        const postAge = Date.now() - lastModified.getTime()
        const ageInDays = postAge / (1000 * 60 * 60 * 24)
        const priority = Math.max(0.4, 0.8 - (ageInDays / 365)) // Decrease priority by 0.1 per year, minimum 0.4

        const entry: MetadataRoute.Sitemap[number] = {
          url: ensureSameDomain(post.seo.canonical || `${baseUrl}/${slug}`, baseUrl),
          lastModified,
          changeFrequency: 'weekly' as const,
          priority,
        }

        // Add image information if available
        if (post.featuredImage?.node?.sourceUrl) {
          entry.images = [ensureSameDomain(post.featuredImage.node.sourceUrl, baseUrl)]
        }

        return entry
      })

    sitemapEntries.push(...postUrls)
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error)
  }

  // Fetch and add all categories
  try {
    const categoryData = await client.request<AllCategoriesResult>(GET_ALL_CATEGORIES)
    const categoryUrls = categoryData.categories.nodes
      .filter(category => isSeoUrl(category.slug))
      .map((category) => {
        // Transform slashes if needed
        const slug = category.slug.endsWith('/') ? category.slug.slice(0, -1) : category.slug

        return {
          url: `${baseUrl}/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }
      })

    sitemapEntries.push(...categoryUrls)

    // Check for subcategories using your fetchContent function
    for (const category of categoryData.categories.nodes) {
      try {
        const content = await getContentBySlug(category.slug)
        if (content && content.type === "category" && content.children) {
          for (const subCategory of content.children) {
            if (!isSeoUrl(subCategory.slug)) continue
            
            const subSlug = subCategory.slug.endsWith('/') ? subCategory.slug.slice(0, -1) : subCategory.slug

            sitemapEntries.push({
              url: `${baseUrl}/category/${subSlug}`,
              lastModified: new Date(),
              changeFrequency: 'weekly' as const,
              priority: 0.6,
            })
          }
        }
      } catch (error) {
        console.error(`Error processing subcategories for ${category.slug}:`, error)
      }
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error)
  }

  // Fetch and add all WordPress pages
  try {
    const pageData = await client.request<AllPagesResult>(GET_ALL_PAGES)
    const pageUrls = pageData.pages.nodes
      .filter(page => isSeoUrl(page.slug))
      .map((page) => {
        // Transform slashes if needed
        const slug = page.slug.endsWith('/') ? page.slug.slice(0, -1) : page.slug
        const lastModified = page.modified ? new Date(page.modified) : new Date()

        // Calculate priority based on page importance
        const priority = slug === 'home' || slug === 'index' ? 1.0 : 0.7

        return {
          url: `${baseUrl}/${slug}`,
          lastModified,
          changeFrequency: 'monthly' as const,
          priority,
        }
      })

    sitemapEntries.push(...pageUrls)
  } catch (error) {
    console.error('Error fetching pages for sitemap:', error)
  }

  // Deduplicate URLs (in case there are any duplicates)
  const uniqueEntries = Array.from(
    new Map(sitemapEntries.map(item => [item.url, item])).values()
  )

  // Sort entries by priority (highest first) and then by lastModified (newest first)
  return uniqueEntries.sort((a, b) => {
    if (a.priority !== undefined && b.priority !== undefined) {
      const priorityDiff = b.priority - a.priority
      if (priorityDiff !== 0) return priorityDiff
    }
    
    const aDate = a.lastModified instanceof Date ? a.lastModified : new Date(a.lastModified || '')
    const bDate = b.lastModified instanceof Date ? b.lastModified : new Date(b.lastModified || '')
    return bDate.getTime() - aDate.getTime()
  })
}