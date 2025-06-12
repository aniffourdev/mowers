// // import React from "react";
// // import Link from "next/link";
// // import { Lato } from "next/font/google";
// // import Image from "next/image";
// // import { product_reviews } from "@/api/graphql/content/articles";
// // import { getBlurData } from "@/utils/blur-data-generator";

// // const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

// // const ProductReviews = async () => {
// //   const posts = await product_reviews();

// //   // Fetch blur data for each post
//   // const postsWithBlurData = await Promise.all(
//   //   posts.map(async (post) => {
//   //     const blurData = await getBlurData(
//   //       post.featuredImage?.node?.sourceUrl ||
//   //         `https://gvr.ltm.temporary.site/mower//wp-content/uploads/2025/02/load.jpg`
//   //     );
//   //     return { ...post, blurData };
//   //   })
//   // );

// //   return (
// //     <section className="bg-slate-50 py-10">
// //       <div className="max-w-screen-lg mx-auto p-4">
// //         <div className="flex justify-center items-center flex-col">
// //           <h2
// //             className={`${lato.className} mb-[0.4em] pb-[0.3em] text-center text-lg tracking-[2px] uppercase text-black`}
// //           >
// //             <Link href="/product-reviews">riding lawn mower</Link>
// //           </h2>
// //           <p className="text-slate-700 text-sm text-center max-w-md">
// //             Find honest product reviews to help you choose the best options.
// //             Explore our top picks today!
// //           </p>
// //         </div>
// //         {postsWithBlurData.length > 0 ? (
// //           <div className="columns-2 md:columns-3 gap-3 md:gap-7 mt-14">
// //             {postsWithBlurData.map((post) => (
// //               <article key={post.slug} className="mb-6">
// //                 <figure className="mb-3">
// //                   <Link
// //                     href={`/${post.slug}`}
// //                     aria-label={`View post: ${post.title}`}
// //                   >
// //                     <Image
// //                       src={
// //                         post.featuredImage?.node?.sourceUrl ||
// //                         `https://gvr.ltm.temporary.site/mower//wp-content/uploads/2025/02/load.jpg`
// //                       }
// //                       alt={`${post.title}`}
// //                       title={post.featuredImage?.node.title || post.title}
// //                       width={400}
// //                       height={280}
// //                       className="w-full h-auto"
// //                       placeholder="blur"
// //                       blurDataURL={post.blurData}
// //                     />
// //                   </Link>
// //                 </figure>
// //                 <h3 className={`!text-black !text-xs md:!text-sm !uppercase`}>
// //                   {post.title.length > 30
// //                     ? `${post.title.substring(0, 30)}...`
// //                     : post.title}
// //                 </h3>
// //                 <div className="flex justify-start items-start md:items-center gap-2 md:gap-4 mb-3.5 mt-2 flex-col md:flex-row">
// //                   <Link
// //                     href={`/${post.categories.nodes[0].slug}`}
// //                     className={`py-0.5 pt-[3px] px-1.5 text-black text-[10px] tracking-[1px] uppercase border-black border-[1px] transition-all hover:text-white hover:bg-black`}
// //                   >
// //                     {post.categories.nodes[0].name}
// //                   </Link>
// //                   <time
// //                     dateTime={post.seo.opengraphPublishedTime}
// //                     className="text-slate-700 text-[10px] md:text-xs uppercase"
// //                   >
// //                     {new Date(
// //                       post.seo.opengraphPublishedTime
// //                     ).toLocaleDateString("en-US", {
// //                       year: "numeric",
// //                       month: "long",
// //                       day: "numeric",
// //                     })}
// //                   </time>
// //                 </div>
// //                 <p className="text-slate-700 text-xs">
// //                   {post.seo.metaDesc.length > 70
// //                     ? `${post.seo.metaDesc.substring(0, 70)}...`
// //                     : post.seo.metaDesc}
// //                 </p>
// //               </article>
// //             ))}
// //           </div>
// //         ) : (
// //           <div
// //             className={`${lato.className} text-xs space-y-1 flex justify-center items-center my-8 flex-col`}
// //           >
// //             <p className="capitalize text-sm">No articles found,</p>
// //             <Link
// //               href={`${process.env.NEXT_PUBLIC_ENDPOINT}/wp-admin/edit.php`}
// //               target="_blank"
// //               className="font-bold uppercase underline"
// //             >
// //               Add your first article
// //             </Link>
// //           </div>
// //         )}
// //       </div>
// //     </section>
// //   );
// // };

// // export default ProductReviews;

// import React from 'react'

// const ProductReviews = () => {
//   return (
//     <div>ProductReviews</div>
//   )
// }

// export default ProductReviews

"use client";
import React, { useEffect, useState } from "react";
import { fetchProducts } from "@/api/rest/fetchFunctions";
import { Product } from "@/libs/interfaces";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Lato } from "next/font/google";
import Link from "next/link";
import { Star, StarHalf } from "lucide-react";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const ProductList = () => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err) {
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to render star ratings
  const renderStars = (rating: any) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half-star"
          className="w-4 h-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    // Add empty stars to make total of 5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-star-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  if (loading)
    return (
      <>
        <div className="mb-4">
          <Skeleton height={100} className="w-full rounded mb-2" />
          <Skeleton height={30} className="w-full rounded mb-1" />
          <div className="flex gap-2.5">
            <div className="w-8/12">
              <Skeleton height={20} className="w-full" />
            </div>
            <div className="w-4/12">
              <Skeleton height={20} className="w-full" />
            </div>
          </div>
        </div>
        <div className="mb-4">
          <Skeleton height={100} className="w-full rounded mb-2" />
          <Skeleton height={25} className="w-full rounded mb-1" />
          <div className="flex gap-2.5">
            <div className="w-8/12">
              <Skeleton height={20} className="w-full" />
            </div>
            <div className="w-4/12">
              <Skeleton height={20} className="w-full" />
            </div>
          </div>
        </div>
      </>
    );
  if (error) return <p>Error: {error}</p>;
  if (!products) return <p>No products found.</p>;

  return (
    <div className="mb-16 border-t-2 border-slate-200 pt-3">
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
        {products.map((product) => (
          <Link
            key={product.id}
            href={product.meta.affiliation_link_url}
            target="_blank"
          >
            <article className="border-b-[0px] lg:border-b-[1px] border-slate-200 pb-2.5">
              <div className="overflow-hidden rounded bg-gray-100 mb-2">
                <Image
                  src={product.meta.featured_image}
                  alt={product.title}
                  width={200}
                  height={250}
                  className="object-cover h-[130px] group-hover:scale-110 transition-transform duration-200 w-full"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={`!text-black block !text-xs md:!text-[13px] !normal-case !mb-1`}
                >
                  {product.title.length > 35
                    ? `${product.title.substring(0, 35)}...`
                    : product.title}
                </h3>
                <div className="flex justify-start items-center gap-2.5">
                  <div className="flex items-center">
                    <div className="flex">
                      {renderStars(product.meta.rating)}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.meta.rating})
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-slate-700 line-through">
                    ${product.meta.regular_price}
                  </div>
                  <div className="font-semibold text-md text-emerald-600">
                    ${product.meta.sale_price}
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
