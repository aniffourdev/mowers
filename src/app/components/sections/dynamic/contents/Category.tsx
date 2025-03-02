import React from "react";
import { Lato, Poppins } from "next/font/google";
import About from "@/app/components/widgets/About";
import Newsletter from "@/app/components/sections/static/Newsletter";
import Image from "next/image";
import Link from "next/link";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });

interface Post {
  title: string;
  slug: string;
  content: string;
  date: string;
  seo: {
    metaDesc: string;
    title: string;
    opengraphPublishedTime?: string; // Make this optional
    opengraphModifiedTime?: string; // Make this optional
  };
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
      title: string;
    } | null;
  } | null;
}

interface CategoryProps {
  content: {
    name: string;
    description: string;
    categoryImage: string;
    slug: string;
    posts: {
      nodes: Post[];
    };
    children?: {
      nodes: {
        posts: { nodes: Post[] };
        name: string;
        slug: string;
        description: string;
      }[];
    };
  };
}

const sanitizeHtml = (html: string) => {
  return html.replace(/<[^>]*>/g, "");
};

const truncateContent = (content: string, maxLength: number) => {
  const sanitizedContent = sanitizeHtml(content);
  return sanitizedContent.length > maxLength
    ? sanitizedContent.substring(0, maxLength) + "..."
    : sanitizedContent;
};

const Category: React.FC<CategoryProps> = ({ content }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Use ISO format to avoid locale issues
  };

  return (
    <main className="max-w-screen-lg mx-auto p-4 my-10">
      <div className="lg:flex gap-10">
        <div className="lg:w-9/12">
          <div className="mb-10">
            <div
              className={`${lato.className} uppercase text-slate-400 font-[600] text-xs tracking-widest`}
            >
              Posts in
            </div>
            <h1
              className={`${poppins.className} text-[26px] text-black font-bold uppercase mt-1`}
            >
              {content.name}
            </h1>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-7">
            {content.posts.nodes.map((post) => (
              <article key={post.slug} className="mb-10">
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
                      title={post.featuredImage?.node?.title || post.title}
                      loading="lazy"
                      width={400}
                      height={280}
                      objectFit="cover"
                      className="w-full h-auto"
                    />
                  </Link>
                </figure>
                <h3 className={`!text-black !text-sm !uppercase`}>{post.title}</h3>
                <div className="flex justify-start items-center gap-4 mb-3.5 mt-2">
                  <Link
                    href={`/${content.slug}`}
                    className={`border-2 border-black px-2 pt-[2.5px] py-0.5 text-xs uppercase transition-all duration-300 hover:text-white hover:bg-black`}
                  >
                    {content.name}
                  </Link>
                  <time
                    dateTime={post.seo.opengraphPublishedTime || ""}
                    className="text-[#222] text-xs uppercase"
                  >
                    {post.seo.opengraphPublishedTime
                      ? formatDate(post.seo.opengraphPublishedTime)
                      : "Date Unavailable"}
                  </time>
                </div>
                <p className="text-slate-700 text-xs">
                  {truncateContent(post.content, 90)}
                </p>
              </article>
            ))}
          </div>
        </div>
        <div className="lg:w-3/12">
          <About />
          <Newsletter />
        </div>
      </div>
    </main>
  );
};

export default Category;
