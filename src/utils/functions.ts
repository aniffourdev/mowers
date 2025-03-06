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
  let content = await getContentBySlug(slug);
  const { slug: categorySlug } = content;

  if (content) {
    const parentContent = await getContentBySlug(categorySlug);
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

  if (!content) {
    return {
      title: "Not Found",
      description: "The page you are looking for does not exist.",
    };
  }

  const description = content.seo?.metaDesc || "";
  const canonicalUrl = `https://www.${process.env.NEXT_PUBLIC_FRONTEND}/${slug}`;

  return {
    title: content.seo?.title || content.title,
    description: content.seo?.metaDesc || "",
    openGraph: {
      title: content.seo?.title || content.title,
      description: content.seo?.metaDesc || "",
      type: content.type === "post" ? "article" : "website",
      publishedTime: content.seo?.opengraphPublishedTime,
      modifiedTime: content.seo?.opengraphModifiedTime,
      authors: content.author ? [content.author.node.name] : [],
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
      description: content.seo?.metaDesc || "",
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
}