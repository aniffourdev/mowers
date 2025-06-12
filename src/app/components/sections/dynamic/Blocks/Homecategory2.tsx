import React from "react";
import { Lato } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { home_category_2 } from "@/api/graphql/content/articles";
import { getBlurData } from "@/utils/blur-data-generator";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const Homecategory2 = async () => {
  const posts = await home_category_2();

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
    <section 
      className="bg-white py-10 pt-0 !mb-0"
      aria-label="Battery lawn mower articles"
    >
      <div className="max-w-screen-lg mx-auto p-4">
        <header className="flex justify-center items-center flex-col">
          <h2
            className={`!${lato.className} !pb-[0.3em] !text-center !text-[16px] !tracking-[2px] !uppercase !text-slate-800`}
          >
            Battery Lawn
          </h2>
          <p className="text-slate-700 text-sm text-center max-w-lg">
            Find top battery-powered lawn mowers that offer quiet, eco-friendly,
            and hassle-free mowing—perfect for small to medium yards.
          </p>
        </header>
        {postsWithBlurData.length > 0 ? (
          <div 
            className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-14"
            role="list"
            aria-label="Battery lawn mower articles"
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
                      className="w-full h-[200px] object-cover"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </Link>
                </figure>
                <h3
                  className={`!text-black !text-xs md:!text-sm !uppercase hidden lg:block`}
                >
                  {post.title.length > 30
                    ? `${post.title.substring(0, 30)}...`
                    : post.title}
                </h3>
                <h3
                  className={`!text-black !text-xs md:!text-sm !uppercase block lg:hidden`}
                >
                  {post.title.length > 23
                    ? `${post.title.substring(0, 23)}...`
                    : post.title}
                </h3>
                <p className="text-slate-700 text-xs hidden lg:block">
                  {post.seo.metaDesc.length > 85
                    ? `${post.seo.metaDesc.substring(0, 85)}...`
                    : post.seo.metaDesc}
                </p>
                <p className="text-slate-700 text-xs block lg:hidden">
                  {post.seo.metaDesc.length > 65
                    ? `${post.seo.metaDesc.substring(0, 65)}...`
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
      </div>
    </section>
  );
};

export default Homecategory2;
