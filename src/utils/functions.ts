import { getContentBySlug } from "@/api/graphql/content/content";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Post {
  title: string;
  slug: string;
}

export async function fetchContent(slug: string, page: number = 1, perPage: number = 10) {
  let content = await getContentBySlug(slug, page, perPage);
  console.log("Fetched Content:", content); // Debug log
  const { slug: categorySlug } = content;

  if (content) {
    const parentContent = await getContentBySlug(categorySlug, page, perPage);
    if (parentContent?.type === "category") {
      const childSlug = categorySlug;
      content = await getContentBySlug(childSlug, page, perPage); // Pass page and perPage
      if (content) {
        content = { ...content, slug: categorySlug, isSubCategory: true };
      }
    }
  }
  return content;
}

export function generateSchemaMarkup(content: any) {
  let schemaMarkup = {};

  switch (content.type) {
    case "post":
      schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: content.title,
        description: content.seo?.metaDesc || content.seo?.metaDesc,
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
        description: content.seo?.metaDesc || content.seo?.metaDesc,
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
    case "faq":
      schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: content.faqs.map((faq: any) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      };
      break;
    case "video":
      schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        name: content.title,
        description: content.seo?.metaDesc || content.seo?.metaDesc,
        thumbnailUrl: content.thumbnailUrl,
        uploadDate: content.uploadDate,
        contentUrl: content.videoUrl,
      };
      break;
    case "user":
      schemaMarkup = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
          "@type": "Person",
          name: content.name,
          description: content.description,
          image: content.avatar?.url || "",
        },
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await fetchContent(slug);
  console.log("Content for Metadata:", content); // Debug log

  if (!content) {
    return {
      title: "Not Found",
      description: "The page you are looking for does not exist.",
    };
  }

  const description = content.seo?.metaDesc || content.description || "";
  const canonicalUrl = `https://www.${process.env.NEXT_PUBLIC_FRONTEND}/${slug}`;

  return {
    title: content.seo?.title || content.title || content.name, // Include content.name for categories and authors
    description: description,
    openGraph: {
      title: content.seo?.title || content.title || content.name, // Include content.name for categories and authors
      description: description,
      type: content.type === "post" ? "article" : "website",
      publishedTime: content.seo?.opengraphPublishedTime,
      modifiedTime: content.seo?.opengraphModifiedTime,
      authors: content.author ? [content.author.node.name] : [],
      images: [
        {
          url: content.featuredImage?.node?.sourceUrl || content.avatar?.url || "",
          alt: content.featuredImage?.node?.altText || "",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: content.seo?.title || content.title || content.name, // Include content.name for categories and authors
      description: description,
      images: [content.featuredImage?.node?.sourceUrl || content.avatar?.url || ""],
    },
    robots: {
      index: content.type !== "tag" && content.type !== "user", // Set to noindex for tags and authors
      follow: true,
      googleBot: {
        index: content.type !== "tag" && content.type !== "user", // Set to noindex for tags and authors
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
}
