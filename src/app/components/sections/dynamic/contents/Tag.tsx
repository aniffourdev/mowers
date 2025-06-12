import React from "react";
import { Lato, Poppins } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
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

interface TagProps {
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

const Tag: React.FC<TagProps> = ({ content }) => {
  const sanitizeHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Use ISO format to avoid locale issues
  };

  const truncateContent = (content: string, maxLength: number) => {
    const sanitizedContent = sanitizeHtml(content);
    return sanitizedContent.length > maxLength
      ? sanitizedContent.substring(0, maxLength) + "..."
      : sanitizedContent;
  };

  return (
    <main className="max-w-screen-lg mx-auto p-4 my-10">
      <div className="lg:flex gap-10">
        <div className="lg:w-9/12">
          <div className="mb-10">
            <div
              className={`${lato.className} uppercase text-slate-700 font-[600] text-xs tracking-widest`}
            >
              Posts in
            </div>
            <h1
              className={`${Parafina.className} text-3xl text-black font-bold uppercase mt-1`}
            >
              {content.name}
            </h1>
          </div>
          <div className="">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-7">
              {content.posts.nodes.map((post) => (
                <article key={post.slug} className="mb-6">
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
                        loading="lazy"
                        width={400}
                        height={280}
                        className="w-full h-auto"
                      />
                    </Link>
                  </figure>
                  <Link
                    href={`/${post.slug}`}
                    aria-label={`View post: ${post.title}`}
                  >
                    <h3
                      className={`!text-black !text-xs md:!text-sm !uppercase`}
                    >
                      {post.title.length > 30
                        ? `${post.title.substring(0, 30)}...`
                        : post.title}
                    </h3>
                  </Link>
                  <div className="flex justify-start items-start md:items-center gap-2 md:gap-4 mb-3.5 mt-2 flex-col md:flex-row">
                    {post.categories.nodes.length > 0 && (
                      <Link
                        href={`/${post.categories.nodes[0].slug}`}
                        className={`py-0.5 pt-[3px] px-1.5 text-black text-[10px] tracking-[1px] uppercase border-black border-[1px] transition-all hover:text-white hover:bg-black`}
                      >
                        {post.categories.nodes[0].name}
                      </Link>
                    )}
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
          </div>
        </div>
      </div>
    </main>
  );
};

export default Tag;
