import React from "react";
import Link from "next/link";
import { Lato } from "next/font/google";
import Image from "next/image";
import { home_category_1 } from "@/api/graphql/content/articles";
import { getBlurData } from "@/utils/blur-data-generator";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const Homecategory1 = async () => {
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
    <section 
      className="mb-20"
      aria-label="Riding lawn mower articles"
    >
      <div className="max-w-screen-lg mx-auto p-4">
        <header className="flex justify-center items-center flex-col">
          <h2
            className={`!${lato.className} !pb-[0.3em] !text-center !text-[16px] !tracking-[2px] !uppercase !text-slate-400`}
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
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14"
            role="list"
            aria-label="Riding lawn mower articles"
          >
            {postsWithBlurData.map((post) => (
              <article 
                key={post.slug} 
                className="mb-10"
                role="listitem"
              >
                <figure className="mb-3">
                  <Link 
                    href={`/`} 
                    aria-label={`Read article: ${post.title}`}
                  >
                    <Image
                      src={
                        post.featuredImage?.node?.sourceUrl ||
                        `https://gvr.ltm.temporary.site/mower//wp-content/uploads/2025/02/load.jpg`
                      }
                      alt={`Featured image for article: ${post.title}`}
                      title={post.title}
                      loading="lazy"
                      width={400}
                      height={300}
                      objectFit="cover"
                      className="w-full h-[250px] lg:h-[400px] object-cover"
                    />
                  </Link>
                </figure>
                <h3
                  className={`!text-black !text-sm !text-center md:!text-sm !uppercase`}
                >
                  {post.title.length > 20
                    ? `${post.title.substring(0, 20)}...`
                    : post.title}
                </h3>
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

export default Homecategory1;
