import React from "react";
import { Lato } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { home_category_1 } from "@/api/graphql/content/articles";
import { getBlurData } from "@/utils/blur-data-generator";
import RecentPosts from "@/app/components/widgets/RecentPosts";
import Products from "@/app/components/widgets/Products";
import Newsletter from "@/app/components/sections/static/Newsletter";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const FeaturedPosts = async () => {
  const posts = await home_category_1();

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
    <main>
      <section 
        className="max-w-screen-lg mx-auto p-4 mb-20"
        aria-label="Featured posts section"
      >
        <div className="lg:flex gap-16">
          <div className="lg:w-9/12">
            <header className="flex justify-center items-center flex-col">
              <h2
                className={`!${lato.className} !pb-[0.3em] !text-center !text-[16px] !tracking-[2px] !uppercase !text-slate-800`}
              >
                Riding Lawn
              </h2>
              <p className="text-slate-700 text-sm text-center max-w-lg">
                Discover the best riding lawn mowers for large yards—compare
                features, comfort, and cutting power to find your perfect match.
              </p>
            </header>
            {postsWithBlurData.length > 0 ? (
              <div 
                className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4 mt-10"
                role="list"
                aria-label="Featured articles"
              >
                {postsWithBlurData.map((post, index) => (
                  <article 
                    key={post.slug} 
                    className="mb-6"
                    role="listitem"
                  >
                    <figure className="mb-3">
                      <Link
                        href={`/${post.slug}`}
                        aria-label={`Read article: ${post.title}`}
                      >
                        <Image
                          src={
                            post.featuredImage?.node?.sourceUrl ||
                            `https://gvr.ltm.temporary.site/mower//wp-content/uploads/2025/02/load.jpg`
                          }
                          alt={`Featured image for article: ${post.title}`}
                          title={post.featuredImage?.node.title || post.title}
                          width={400}
                          height={280}
                          className="w-full h-auto"
                          placeholder="blur"
                          blurDataURL={post.blurData}
                          priority={index === 0}
                          sizes="(max-width: 768px) 100vw, 400px"
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
                    <div 
                      className="flex justify-start items-start md:items-center gap-2 md:gap-4 mb-3.5 mt-2 flex-col md:flex-row"
                      role="contentinfo"
                    >
                      <Link
                        href={`/${post.categories.nodes[0].slug}`}
                        className={`py-0.5 pt-[3px] px-1.5 text-black text-[10px] tracking-[1px] uppercase border-black border-[1px] transition-all hover:text-white hover:bg-black`}
                        aria-label={`View all posts in category: ${post.categories.nodes[0].name}`}
                      >
                        {post.categories.nodes[0].name}
                      </Link>
                      <time
                        dateTime={post.seo.opengraphPublishedTime}
                        className="text-slate-700 text-[10px] md:text-xs uppercase"
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
                role="alert"
                aria-label="No articles found"
              >
                <p className="capitalize text-sm">No articles found,</p>
                <Link
                  href={`${process.env.NEXT_PUBLIC_ENDPOINT}/wp-admin/edit.php`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold uppercase underline"
                  aria-label="Add your first article in WordPress admin"
                >
                  Add your first article
                </Link>
              </div>
            )}
            <nav className="flex justify-center items-center mt-5">
              <Link
                href="/blog"
                className="border-2 border-black text-xs uppercase px-4 py-2 transition-all duration-200 hover:bg-black hover:text-white"
                aria-label="View all blog posts"
              >
                See more posts
              </Link>
            </nav>
          </div>
          <aside className="lg:w-3/12">
            <div className="mt-16 lg:mt-0 sticky top-28">
              <Newsletter />
              <RecentPosts />
              <Products />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default FeaturedPosts;
