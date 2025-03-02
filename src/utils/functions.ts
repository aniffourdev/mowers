import { getContentBySlug } from "@/api/graphql/content/content";
import { Metadata } from "next";

// Define the interface for the props
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface Post {
  title: string;
  slug: string;
}

/**
 * Fetch content by slug.
 * @param slugprops - The slug to fetch content for.
 * @returns The content associated with the slug.
 */
export async function fetchContent(slugprops: string) {
  let content = await getContentBySlug(slugprops);


  const { slug } = content;

  if (content) {
    const parentContent = await getContentBySlug(slug);
    if (parentContent?.type === "category") {
      const childSlug = slug;
      content = await getContentBySlug(childSlug);
      if (content) {
        content = { ...content, slug, isSubCategory: true };
      }
    }
  }
  return content;
}

/**
 * Generate schema markup based on the content type.
 * @param content - The content for which to generate schema markup.
 * @returns Schema markup as an object.
 */
export function generateSchemaMarkup(content: any) {
  let schemaMarkup = {};

  switch (content.type) {
    case "post":
      schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: content.title,
        description: content.seo?.metaDesc || content.description,
        image: content.featuredImage?.node?.sourceUrl || "",
        author: {
          "@type": "Person",
          name: content.author?.node?.name,
        },
        datePublished: content.seo?.opengraphPublishedTime,
        dateModified: content.seo?.opengraphModifiedTime,
      };
      break;
    case "page":
      schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: content.title,
        description: content.description,
      };
      break;
    case "category":
    case "subCategory":
      schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: content.name,
        itemListElement: Array.isArray(content.posts)
          ? content.posts.map((post: Post, index: number) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "BlogPosting",
                name: post.title,
                url: `/${post.slug}`,
              },
            }))
          : [],
      };
      break;
    case "tag":
      schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: content.name,
        itemListElement: Array.isArray(content.posts)
          ? content.posts.map((post: Post, index: number) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "BlogPosting",
                name: post.title,
                url: `/${post.slug}`,
              },
            }))
          : [],
      };
      break;
    default:
      schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Dynamic Content Page",
      };
      break;
  }

  return schemaMarkup;
}

/**
 * Generate metadata for the page based on the content.
 * @param params - The params object containing the slug.
 * @returns Metadata for the page.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params; // Unwrap the params Promise
  const content = await fetchContent(slug);

  if (!content) {
    return {
      title: "Not Found",
      description: "The page you are looking for does not exist.",
    };
  }

  const description = content.description || (content.content ? content.content.substring(0, 160) : "");
  const canonicalUrl = `https://www.${process.env.NEXT_PUBLIC_FRONTEND}/${slug}`;

  switch (content.type) {
    case "category":
      return {
        title: content.name,
        description,
        alternates: {
          canonical: canonicalUrl,
        },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
      };
    case "page":
      return {
        title: content.title,
        description: content.seo?.metaDesc || description,
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
        alternates: {
          canonical: canonicalUrl,
        },
      };
    case "post":
      return {
        title: content.title,
        description: content.seo?.metaDesc || description,
        openGraph: {
          title: content.seo?.title || content.title,
          description: content.seo?.metaDesc || description,
          type: "article",
          publishedTime: content.seo?.opengraphPublishedTime,
          modifiedTime: content.seo?.opengraphModifiedTime,
          authors: [content.author?.node?.name],
          images: [
            {
              url: content.featuredImage?.node?.sourceUrl || "",
              alt: content.featuredImage?.node?.altText || "",
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: content.seo?.title || content.title,
          description: content.seo?.metaDesc || description,
          images: [content.featuredImage?.node?.sourceUrl || ""],
        },
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
        alternates: {
          canonical: canonicalUrl,
        },
      };
    case "tag":
      return {
        title: content.title,
        description: content.seo?.metaDesc || description,
        robots: {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
        alternates: {
          canonical: canonicalUrl,
        },
      };
    default:
      return {
        title: "Content",
        description: "Dynamic content page",
        alternates: {
          canonical: canonicalUrl,
        },
      };
  }
}
