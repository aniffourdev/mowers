"use client";
import React, { useEffect, useState } from "react";
import { generateSchemaMarkup } from "@/utils/functions";
import Post from "@/app/components/sections/dynamic/contents/Post";
import Tag from "@/app/components/sections/dynamic/contents/Tag";
import Category from "@/app/components/sections/dynamic/contents/Category";
import Page from "@/app/components/sections/dynamic/contents/Page";
import Author from "@/app/components/sections/dynamic/contents/Author";
import NotFound from "../components/NotFound";

interface DynamicPageClientProps {
  content: any;
}

const DynamicPageClient: React.FC<DynamicPageClientProps> = ({ content }) => {
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!content) {
      setError(true);
    }
  }, [content]);

  if (error) {
    return <NotFound />;
  }

  const schemaMarkup = generateSchemaMarkup(content);

  let contentComponent;
  switch (content.type) {
    case "post":
      contentComponent = <Post post={content} />;
      break;
    case "category":
      contentComponent = <Category content={content} />;
      break;
    case "tag":
      contentComponent = <Tag content={content} />;
      break;
    case "page":
      contentComponent = <Page content={content} />;
      break;
    case "user":
      contentComponent = <Author content={content} />;
      break;
    default:
      contentComponent = <NotFound />;
  }

  return (
    <>
      {contentComponent}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
    </>
  );
};

export default DynamicPageClient;
