import React from "react";
import Link from "next/link";
import { Lato } from "next/font/google";
import Image from "next/image";
import { products_review } from "@/api/graphql/content/articles";
import { getBlurData } from "@/utils/blur-data-generator";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const ProductsReview = async () => {
  const posts = await products_review();

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
    <section className="bg-slate-50 py-10 mb-20">
      <div className="max-w-screen-lg mx-auto p-4">
        <div className="flex justify-center items-center flex-col">
          <h2
            className={`!${lato.className} !pb-[0.3em] !text-center !text-[16px] !tracking-[2px] !uppercase !text-slate-400`}
          >
            Products Review
          </h2>
          <p className="text-slate-700 text-sm text-center max-w-lg">
            Honest and detailed lawn mower reviews to help you choose the best
            model for your yard—based on performance, price, and reliability
          </p>
        </div>
        {postsWithBlurData.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-14">
            {postsWithBlurData.map((post) => (
              <article key={post.slug} className="mb-10">
                <figure className="mb-3">
                  <Link href={`/`} aria-label={`View post: ${post.title}`}>
                    <Image
                      src={
                        post.featuredImage?.node?.sourceUrl ||
                        `https://gvr.ltm.temporary.site/mower//wp-content/uploads/2025/02/load.jpg`
                      }
                      alt={`${post.title}`}
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
      </div>
    </section>
  );
};

export default ProductsReview;
