import { notFound } from 'next/navigation';
import { fetchContent, generateMetadata as generateContentMetadata } from "@/utils/functions";
import DynamicPageClient from "./DynamicPageClient";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

const DynamicPage = async ({ params }: PageProps) => {
  const { slug } = await params; // Unwrap the params Promise
  const content = await fetchContent(slug);

  if (!content) {
    notFound();
  }

  return <DynamicPageClient content={content} />;
};

export default DynamicPage;

// Generate metadata on the server side
export const generateMetadata = async ({ params }: PageProps) => {
  return generateContentMetadata({ params });
};
