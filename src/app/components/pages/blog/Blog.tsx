"use client";
import { useState } from "react";
import { gql } from "@apollo/client";
import client from "@/api/apollo/client";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

// Define types for the Post and GraphQL response
interface Post {
  id: string;
  categories: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
  date: string;
  title: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      title: string;
    };
  };
  seo: {
    metaDesc: string;
    opengraphPublishedTime: string;
  };
  slug: string;
}

interface QueryResult {
  posts: {
    edges: {
      node: Post;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

interface BlogPostsProps {
  initialPosts: Post[];
  initialHasNextPage: boolean;
  initialEndCursor: string | null;
}

const GET_MORE_POSTS = gql`
  query GetMorePosts($after: String) {
    posts(first: 9, after: $after, where: { status: PUBLISH }) {
      edges {
        node {
          id
          date
          title
          content
          categories {
            nodes {
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
              altText
              title
            }
          }
          seo {
            metaDesc
            opengraphPublishedTime
          }
          slug
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export default function BlogPosts({
  initialPosts,
  initialHasNextPage,
  initialEndCursor,
}: BlogPostsProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [endCursor, setEndCursor] = useState<string | null>(initialEndCursor);

  // Simulate initial loading for skeleton
  useState(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  });

  const handleLoadMore = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { data } = await client.query<QueryResult>({
        query: GET_MORE_POSTS,
        variables: {
          after: endCursor,
        },
      });

      setPosts([...posts, ...data.posts.edges.map((edge) => edge.node)]);
      setHasNextPage(data.posts.pageInfo.hasNextPage);
      setEndCursor(data.posts.pageInfo.endCursor);
    } catch (error) {
      console.error("Error loading more posts:", error);
    }
    setIsLoading(false);
  };

  return (
    <main className="mt-14">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-7">
        {initialLoading
          ? // Show 6 skeleton placeholders while loading
            [...Array(6)].map((_, index) => <Skeleton key={index} height={320} />)
          : // Show actual posts once loaded
            posts.map((post) => (
              <article key={post.slug} className="mb-6">
                <figure className="mb-3">
                  <Link
                    href={`/${post.slug}`}
                    aria-label={`View post: ${post.title}`}
                  >
                    <Image
                      src={
                        post.featuredImage?.node?.sourceUrl ||
                        `https://gvr.ltm.temporary.site/mower//wp-content/uploads/2025/02/load.jpg`
                      }
                      alt={`${post.title}`}
                      title={post.featuredImage?.node.title || post.title}
                      width={400}
                      height={280}
                      className="w-full h-auto"
                    />
                  </Link>
                </figure>
                <h3 className={`!text-black !text-xs md:!text-sm !uppercase`}>
                  {post.title.length > 30
                    ? `${post.title.substring(0, 30)}...`
                    : post.title}
                </h3>
                <div className="flex justify-start items-start md:items-center gap-2 md:gap-4 mb-3.5 mt-2 flex-col md:flex-row">
                  <Link
                    href={`/${post.categories.nodes[0].slug}`}
                    className={`py-0.5 pt-[3px] px-1.5 text-black text-[10px] tracking-[1px] uppercase border-black border-[1px] transition-all hover:text-white hover:bg-black`}
                  >
                    {post.categories.nodes[0].name}
                  </Link>
                  <time
                    dateTime={post.seo.opengraphPublishedTime}
                    className="text-slate-500 text-[10px] md:text-xs uppercase"
                  >
                    {new Date(
                      post.seo.opengraphPublishedTime
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <p className="text-slate-700 text-xs">
                  {post.seo.metaDesc.length > 70
                    ? `${post.seo.metaDesc.substring(0, 70)}...`
                    : post.seo.metaDesc}
                </p>
              </article>
            ))}
      </div>

      {hasNextPage && !initialLoading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="bg-amber-500 hover:bg-amber-400 text-gray-900 px-6 rounded py-2 font-semibold transition-colors duration-200 disabled:bg-amber-200"
          >
            {isLoading ? "Loading..." : "See more articles..."}
          </button>
        </div>
      )}
    </main>
  );
}
