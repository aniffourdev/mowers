import React from "react";
import { Lato } from "next/font/google";
import Image from "next/image";
import { recent_posts } from "@/api/graphql/content/articles";
import { getBlurData } from "@/utils/blur-data-generator";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const RecentPosts = async () => {
  const posts = await recent_posts();

  // Fetch blur data for each post
  const postsWithBlurData = await Promise.all(
    posts.map(async (post) => {
      const blurData = await getBlurData(
        post.featuredImage?.node?.sourceUrl ||
          `https://gvr.ltm.temporary.site/mower//wp-content/uploads/2025/02/load.jpg`
      );
      return { ...post, blurData };
    })
  );

  return (
    <aside 
      className="mb-9"
      aria-label="Recent blog posts"
    >
      <header>
        <h2
          className={`!${lato.className} !uppercase !text-slate-400 !font-[600] !text-xs !tracking-widest`}
        >
          Recent Posts
        </h2>
      </header>
      <div 
        className="space-y-3.5"
        role="list"
        aria-label="List of recent posts"
      >
        {postsWithBlurData.map((post) => (
          <article 
            key={post.slug} 
            className="flex items-center space-x-4"
            role="listitem"
          >
            <figure>
              <Image
                src={
                  post.featuredImage?.node?.sourceUrl ||
                  `https://gvr.ltm.temporary.site/mower//wp-content/uploads/2025/02/load.jpg`
                }
                alt={`Featured image for article: ${post.title}`}
                title={post.featuredImage?.node.title || post.title}
                sizes="50px"
                className="w-16 h-16"
                height={50}
                width={50}
              />
            </figure>
            <div>
              <h4 className="!text-black !font-semibold !uppercase !text-xs !mb-[-2px] !mt-0">
                {post.title.length > 30
                  ? `${post.title.substring(0, 30)}...`
                  : post.title}
              </h4>
              <time
                dateTime={post.seo.opengraphPublishedTime}
                className="text-slate-400 text-[10px] uppercase mt-0"
              >
                {new Date(post.seo.opengraphPublishedTime).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </time>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
};

export default RecentPosts;
