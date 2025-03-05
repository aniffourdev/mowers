import React from "react";
import { Lato } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { featured_articles } from "@/api/graphql/content/articles";
import { getBlurData } from "@/utils/blur-data-generator";
import RecentPosts from "@/app/components/widgets/RecentPosts";
import Newsletter from "@/app/components/sections/static/Newsletter";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const FeaturedPosts = async () => {
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
    <>
      <section className="max-w-screen-lg mx-auto p-4 mb-20">
        <div className="lg:flex gap-9">
          <div className="lg:w-9/12">
            <h2
              className={`!${lato.className} !mb-[1.4em] !pb-[0.3em] !text-center !text-md !tracking-[2px] !uppercase !text-[#ababab]`}
            >
              Featured Articles
            </h2>
            {postsWithBlurData.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-7">
                {postsWithBlurData.map((post) => (
                  <article key={post.slug} className="mb-6">
                    <figure className="mb-3">
                      <Link
                        href={`/${post.slug}`}
                        aria-label={`View post: ${post.title}`}
                      >
                        <Image
                          src={
                            post.featuredImage?.node?.sourceUrl ||
                            `https://www.gvr.ltm.temporary.site/mower/wp-content/uploads/2025/02/load.jpg`
                          }
                          alt={`${post.title}`}
                          title={post.featuredImage?.node.title || post.title}
                          width={400}
                          height={280}
                          className="w-full h-auto"
                          placeholder="blur"
                          blurDataURL={post.blurData}
                        />
                      </Link>
                    </figure>
                    <h3
                      className={`!text-black !text-xs md:!text-sm !uppercase`}
                    >
                      {post.title.length > 30
                        ? `${post.title.substring(0, 30)}...`
                        : post.title}
                    </h3>
                    <div className="flex justify-start items-start md:items-center gap-2 md:gap-4 mb-3.5 mt-2 flex-col md:flex-row">
                      <Link
                        href={`/${post.categories.nodes[0].slug}`}
                        className={`border-2 border-black px-1 md:px-2 pt-[2.5px] py-[1.5px] md:py-0.5 text-[10px] md:text-xs uppercase transition-all duration-300 hover:text-white hover:bg-black`}
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
            ) : (
              <div
                className={`${lato.className} text-xs space-y-1 flex justify-center items-center my-8 flex-col`}
              >
                <p className="capitalize text-sm">No articles found,</p>
                <Link
                  href={`${process.env.NEXT_PUBLIC_ENDPOINT}/wp-admin/edit.php`}
                  target="_blank"
                  className="font-bold uppercase underline"
                >
                  Add your first article
                </Link>
              </div>
            )}
            <div className="flex justify-center items-center mt-5">
              <Link
                href="/blog"
                className="border-2 border-black text-xs uppercase px-4 py-2 transition-all duration-200 hover:bg-black hover:text-white"
              >
                See more posts
              </Link>
            </div>
          </div>
          <div className="lg:w-3/12">
            <aside className="mt-16 lg:mt-0 sticky top-28">
              <Newsletter />
              <RecentPosts />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeaturedPosts;
