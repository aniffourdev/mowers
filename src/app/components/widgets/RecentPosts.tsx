import React from "react";
import { Lato } from "next/font/google";
import Image from "next/image";
import { featured_articles } from "@/api/graphql/content/articles";
import { getBlurData } from "@/utils/blur-data-generator";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const RecentPosts = async () => {
  const posts = await featured_articles();

  // Fetch blur data for each post
  const postsWithBlurData = await Promise.all(
    posts.map(async (post) => {
      const blurData = await getBlurData(
        post.featuredImage?.node?.sourceUrl ||
          `https://www.gvr.ltm.temporary.site/mower/wp-content/uploads/2025/02/load.jpg`
      );
      return { ...post, blurData };
    })
  );

  return (
    <div className="mb-9">
      <h2
        className={`!${lato.className} !mb-[1.1em] !pb-[0.3em] !text-xs !tracking-[2px] !uppercase !text-[#222]`}
      >
        Recent Posts
      </h2>
      <div className="mb-4">
        {postsWithBlurData.map((post) => (
          <div
            key={post.id}
            className="flex justify-start items-start gap-2.5 mb-2"
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
              <Image
                src={
                  post.featuredImage?.node?.sourceUrl ||
                  `https://www.gvr.ltm.temporary.site/mower/wp-content/uploads/2025/02/load.jpg`
                }
                alt={post.title}
                title={post.featuredImage?.node.title || post.title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                width={100}
                height={0}
                placeholder="blur"
                blurDataURL={post.blurData}
              />
            </div>
            <div>
              <h4 className="!text-black !font-semibold !uppercase !text-[13px] !mb-[-4px] !mt-1">
                {post.title}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentPosts;
