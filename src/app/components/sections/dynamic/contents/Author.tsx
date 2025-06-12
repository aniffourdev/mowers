import React from "react";
import { Lato, Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import About from "@/app/components/widgets/About";
import Newsletter from "@/app/components/sections/static/Newsletter";
import Products from "@/app/components/widgets/Products";
import localFont from 'next/font/local';

const Parafina = localFont({ src: './fonts/parafina.woff2' })

interface Post {
  title: string;
  slug: string;
  content: string;
  categories: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
  date: string;
  seo: {
    metaDesc: string;
    title: string;
    opengraphPublishedTime: string;
    opengraphModifiedTime: string;
  };
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
      title: string;
    } | null;
  } | null;
}

interface AuthorProps {
  content: {
    name: string;
    slug: string;
    posts: {
      nodes: Post[];
    };
  };
}

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

const Author: React.FC<AuthorProps> = ({ content }) => {
  return (
    <main className="max-w-screen-lg mx-auto p-4 my-10">
      <div className="lg:flex gap-10">
        <div className="lg:w-9/12">
          <div className="mb-10">
            <div
              className={`${lato.className} uppercase text-slate-700 font-[600] text-xs tracking-widest`}
            >
              Posts by
            </div>
            <h1
              className={`${Parafina.className} text-3xl text-black font-bold uppercase mt-1`}
            >
              {content.name}
            </h1>
          </div>
          <div>
            {content.posts.nodes.map((post, index) => (
              <div
                key={post.slug}
                className={`flex flex-col lg:flex-row -mb-[12px] ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                }`}
              >
                <div className="lg:w-6/12">
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
                        title={post.featuredImage?.node?.title || post.title}
                        width={400}
                        height={280}
                        className="w-full h-auto"
                        priority={index === 0}
                        sizes="(max-width: 768px) 100vw, 400px"
                      />
                    </Link>
                  </figure>
                </div>
                <div className="lg:w-6/12">
                  <div className="border-[1px] border-slate-200 py-[106.8px]">
                    <div className="!flex !justify-center !items-center !flex-col !space-y-5 !text-center">
                      <Link href={`/${post.categories.nodes[0].slug}`}>
                        <p
                          className={`${lato.className} py-0.5 pt-[3px] px-1.5 text-[#333333] text-[10px] tracking-[1px] uppercase border-[#222222] border-[1px] transition-all hover:text-white hover:bg-black`}
                        >
                          {post.categories.nodes[0].name}
                        </p>
                      </Link>
                      <h3
                        className={`!text-black !text-[25px] leading-8 !uppercase max-w-[300px]`}
                      >
                        {post.title.length > 30
                          ? `${post.title.substring(0, 30)}...`
                          : post.title}
                      </h3>
                      <Link
                        href={`/${post.slug}`}
                        className={`${lato.className} !text-black !text-[10px] uppercase tracking-[1px] underline border-b-2 transition-all hover:border-b-4 underline-offset-6`}
                      >
                        View Post
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-3/12">
          <About />
          <Newsletter />
          <Products />
        </div>
      </div>
    </main>
  );
};

export default Author;
