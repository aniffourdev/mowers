import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaPlus, FaMinus } from "react-icons/fa";
import { BsPinterest } from "react-icons/bs";
import { Lato, Noto_Sans, Poppins } from "next/font/google";
import parse, { DOMNode, Element } from "html-react-parser";
import About from "@/app/components/widgets/About";
import Newsletter from "@/app/components/sections/static/Newsletter";
import { fetchSocialLinks } from "@/api/rest/fetchFunctions";
import { SocialLinks } from "@/libs/interfaces";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import { motion } from "framer-motion";
import CommentForm from "@/app/components/sections/dynamic/contents/Posts/CommentForm";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import ProductList from "@/app/components/widgets/Products";
import Products from "@/app/components/widgets/Products";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 767, min: 464 },
    items: 2,
    slidesToSlide: 2,
  },
};

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });
const noto = Noto_Sans({ weight: "400", subsets: ["latin"] });

interface PostProps {
  post: {
    title: string;
    content: string;
    featuredImage: {
      node: {
        sourceUrl: string;
        altText: string;
        title: string;
      };
    } | null;
    slug: string;
    tags: {
      nodes: { name: string; slug: string }[];
    };
    category: {
      nodes: {
        name: string;
        slug: string;
        posts: {
          nodes: {
            slug: string;
            title: string;
            content: string;
            seo: {
              metaDesc: string;
              title: string;
              opengraphPublishedTime: string;
              opengraphModifiedTime: string;
            };
            featuredImage: {
              node: { sourceUrl: string; altText: string; title: string };
            };
            categories: { nodes: { name: string; slug: string }[] };
          }[];
        };
      }[];
    };
    author: {
      node: {
        name: string;
        slug: string;
        description: string;
        avatar: {
          url: string;
        };
      };
    } | null;
    seo: {
      metaDesc: string;
      title: string;
      opengraphPublishedTime?: string;
      readingTime?: number;
    };
    categories: {
      nodes: {
        name: string;
        slug: string;
        posts: {
          nodes: {
            slug: string;
            title: string;
            content: string;
            seo: {
              metaDesc: string;
              title: string;
              opengraphPublishedTime: string;
              opengraphModifiedTime: string;
            };
            featuredImage: {
              node: { sourceUrl: string; altText: string; title: string };
            };
            categories: { nodes: { name: string; slug: string }[] };
          }[];
        };
      }[];
    };
    id: string;
  };
}

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(dateString));
};

const sanitizeHtml = (html: string) => {
  return html.replace(/<[^>]*>/g, "");
};

const truncateContent = (content: string, maxLength: number) => {
  const sanitizedContent = sanitizeHtml(content);
  return sanitizedContent.length > maxLength
    ? sanitizedContent.substring(0, maxLength) + "..."
    : sanitizedContent;
};

const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

const generateTableOfContents = (content: string) => {
  const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/g;
  const toc: { text: string; id: string; level: number }[] = [];
  const modifiedContent = content.replace(
    headingRegex,
    (match, level, text) => {
      const cleanText = text.replace(/<[^>]+>/g, "").trim();
      const id = createSlug(cleanText);
      toc.push({ text: cleanText, id, level: parseInt(level) });
      return `<h${level} id="${id}">${text}</h${level}>`;
    }
  );

  return { toc, modifiedContent };
};

const replaceLinks = (content: string) => {
  return parse(content, {
    replace: (domNode: DOMNode) => {
      if (
        domNode instanceof Element &&
        domNode.name === "a" &&
        domNode.attribs?.href
      ) {
        const href = domNode.attribs.href;
        const isInternal =
          href.startsWith("/") ||
          href.includes(`${process.env.NEXT_PUBLIC_FRONTEND}`);
        if (isInternal) {
          return (
            <Link href={href} className={domNode.attribs.class || ""}>
              {domNode.children.map((child, index) =>
                typeof child === "string"
                  ? child
                  : parse(child as unknown as string)
              )}
            </Link>
          );
        }
      }
    },
  });
};

const socialMediaIcons = [
  {
    name: "Facebook",
    icon: FaFacebookF,
    link: "https://www.facebook.com",
  },
  {
    name: "Twitter",
    icon: FaTwitter,
    link: "https://www.twitter.com",
  },
  {
    name: "Pinterest",
    icon: BsPinterest,
    link: "https://www.pinterest.com",
  },
];

const RelatedPosts = ({
  posts,
}: {
  posts: {
    categories: { nodes: { name: string; slug: string }[] };
    seo: {
      metaDesc: string;
      title: string;
      opengraphPublishedTime: string;
    };
    title: string;
    slug: string;
    featuredImage: {
      node: { sourceUrl: string; altText: string; title: string };
    };
  }[];
}) => {
  const settings = {
    dots: false,
  };

  return (
    <section className="my-12">
      <h2
        className={`${lato.className} !text-[12px] !uppercase !text-center !tracking-wide !text-[#222] !mt-0 !mb-4`}
      >
        You May Also Like
      </h2>
      <Carousel
        responsive={responsive}
        autoPlay={true}
        swipeable={true}
        draggable={true}
        showDots={true}
        infinite={true}
        partialVisible={false}
        dotListClass="custom-dot-list-style"
      >
        {posts.map((post) => (
          <article key={post.slug} className="slider mb-6">
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
                  className="w-full h-auto"
                />
              </Link>
            </figure>
            <Link
              href={`/${post.slug}`}
              aria-label={`View post: ${post.title}`}
            >
              <h3
                className={`!text-black text-left !text-xs md:!text-sm !uppercase`}
              >
                {post.title.length > 30
                  ? `${post.title.substring(0, 30)}...`
                  : post.title}
              </h3>
            </Link>
            <div className="flex justify-start items-start md:items-center gap-2 md:gap-4 mb-3.5 mt-2 flex-col md:flex-row">
              <Link
                href={`/${post.slug}`}
                className={`!py-0.5 !pt-[4px] !px-1.5 text-black !text-[10px] !tracking-[1px] !uppercase !border-black !border-[1px] !transition-all hover:text-white hover:bg-black`}
              >
                {post.categories.nodes[0].name}
              </Link>
              <time
                dateTime={post.seo.opengraphPublishedTime}
                className="text-slate-500 !text-[10px] md:text-xs uppercase"
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
            <p className="text-slate-700 text-left text-xs">
              {post.seo.metaDesc.length > 70
                ? `${post.seo.metaDesc.substring(0, 70)}...`
                : post.seo.metaDesc}
            </p>
          </article>
        ))}
      </Carousel>
    </section>
  );
};

const Post: React.FC<PostProps> = ({ post }) => {
  const [socialLinks, setSocialLinks] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [previousPost, setPreviousPost] = useState<PostProps["post"] | null>(
    null
  );
  const [nextPost, setNextPost] = useState<PostProps["post"] | null>(null);

  useEffect(() => {
    const getSocialLinks = async () => {
      try {
        const fetchedSocialLinks = await fetchSocialLinks();
        setSocialLinks(fetchedSocialLinks);
      } catch (error) {
        console.error("Error fetching social links:", error);
      } finally {
        setLoading(false);
      }
    };

    getSocialLinks();
  }, []);

  useEffect(() => {
    if (post && post.categories.nodes.length > 0) {
      const categoryPosts = post.categories.nodes[0].posts.nodes;
      const currentPostIndex = categoryPosts.findIndex(
        (p) => p.slug === post.slug
      );

      if (currentPostIndex > 0) {
        const previous = categoryPosts[currentPostIndex - 1];
        setPreviousPost({
          ...previous,
          tags: { nodes: [] },
          category: { nodes: [] },
          author: null,
          id: "",
          slug: previous.slug,
          title: previous.title,
          content: previous.content,
          seo: previous.seo,
          featuredImage: previous.featuredImage,
          categories: {
            nodes: previous.categories.nodes.map((category) => ({
              ...category,
              posts: { nodes: [] }, // Add the required posts property
            })),
          },
        });
      }

      if (currentPostIndex < categoryPosts.length - 1) {
        const next = categoryPosts[currentPostIndex + 1];
        setNextPost({
          ...next,
          tags: { nodes: [] },
          category: { nodes: [] },
          author: null,
          id: "",
          slug: next.slug,
          title: next.title,
          content: next.content,
          seo: next.seo,
          featuredImage: next.featuredImage,
          categories: {
            nodes: next.categories.nodes.map((category) => ({
              ...category,
              posts: { nodes: [] }, // Add the required posts property
            })),
          },
        });
      }
    }
  }, [post]);

  if (!socialLinks) {
    return null;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const { toc, modifiedContent } = generateTableOfContents(post.content);
  const postUrl = `https://www.${process.env.NEXT_PUBLIC_FRONTEND}/${post.slug}`;

  return (
    <main className="max-w-screen-lg mx-auto p-4 my-16">
      <div className="lg:flex gap-16">
        {loading ? (
          <div className="flex flex-col gap-4">
            <Skeleton height={40} width="60%" />
            <Skeleton height={20} width="80%" />
            <Skeleton height={20} width="70%" />
            <Skeleton height={20} width="90%" />
            <Skeleton height={20} width="80%" />
            <Skeleton height={20} width="70%" />
            <Skeleton height={20} width="90%" />
          </div>
        ) : (
          <MainContent
            post={post}
            modifiedContent={modifiedContent}
            postUrl={postUrl}
            toc={toc}
            previousPost={previousPost}
            nextPost={nextPost}
          />
        )}
        <Sidebar />
      </div>
    </main>
  );
};

const TableOfContents = ({
  toc,
}: {
  toc: { text: string; id: string; level: number }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleToc = () => {
    setIsOpen(!isOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="bg-slate-100 p-5 mb-8" aria-label="Table of Contents">
      <button
        className="flex justify-between items-center w-full cursor-pointer"
        onClick={toggleToc}
        aria-expanded={isOpen}
        aria-controls="toc-content"
      >
        <h2 className="!font-semibold !text-lg !text-black !uppercase !mb-0">
          See What&apos;s Inside
        </h2>
        {isOpen ? (
          <FaMinus className="text-black" />
        ) : (
          <FaPlus className="text-black" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { height: "auto" },
          closed: { height: 0 },
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
        id="toc-content"
      >
        {isOpen && (
          <div className="mt-4 space-y-2">
            <ul>
              {toc.map((item) => (
                <li
                  key={item.id}
                  className={`pb-2 ${item.level === 3 ? "ml-4" : ""}`}
                >
                  <Link
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    className="toc-link text-slate-700 font-semibold text-[13px] transition-all hover:text-slate-950"
                  >
                    {item.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
    </nav>
  );
};

const MainContent = ({
  post,
  modifiedContent,
  postUrl,
  toc,
  previousPost,
  nextPost,
}: {
  post: PostProps["post"];
  modifiedContent: string;
  postUrl: string;
  toc: { text: string; id: string; level: number }[];
  previousPost: PostProps["post"] | null;
  nextPost: PostProps["post"] | null;
}) => (
  <article className="lg:w-9/12">
    <header>
      <nav aria-label="Breadcrumb" className="mb-2">
        <ol className="flex justify-start items-center gap-1.5">
          <li className="!${lato.className} !uppercase !text-slate-400 !font-[600] !text-xs !tracking-widest">
            <Link href="/" className="uppercase">
              Home
            </Link>
          </li>
          <li className="inline-block text-slate-500 text-sm">/</li>
          {post.categories.nodes.length > 0 && (
            <li className="!${lato.className} !uppercase !text-slate-400 !font-[600] !text-xs !tracking-widest">
              <Link
                href={`/${post.categories.nodes[0].slug}`}
                className="uppercase"
              >
                {post.categories.nodes[0].name}
              </Link>
            </li>
          )}
          <li className="inline-block text-slate-500 text-sm">/</li>
        </ol>
      </nav>
      <h1 className="text-2xl lg:text-3xl font-black text-black mt-0">
        {post.title}
      </h1>
      <p className="text-slate-500 text-sm mt-3 mb-8">{post.seo.metaDesc}</p>
      <div className="flex justify-start items-center gap-3 mb-8">
        {post.author && (
          <div
            className="h-11 w-11 bg-slate-200 rounded-full bg-cover bg-center"
            style={{ backgroundImage: `url(${post.author.node.avatar.url})` }}
            aria-label={`Avatar of ${post.author.node.name}`}
          ></div>
        )}
        <div className="flex justify-center items-start flex-col space-y-1">
          <p className="text-gray-800 text-xs font-medium uppercase">
            BY:{" "}
            <Link
              href="/about"
              className="hover:text-gray-900 font-semibold transition-all duration-500"
            >
              {post.author?.node.name}
            </Link>
          </p>
          <time
            dateTime={post.seo.opengraphPublishedTime || ""}
            className="text-slate-500 uppercase text-xs font-medium"
          >
            Published:{" "}
            <span className="font-semibold">
              {post.seo.opengraphPublishedTime
                ? formatDate(post.seo.opengraphPublishedTime)
                : "Date Unavailable"}
            </span>
          </time>
        </div>
      </div>
      <TableOfContents toc={toc} />
    </header>

    <section className="mt-5">
      <div
        className={`${noto.className} single_content text-[#222] text-[14px] tracking-[.2px] leading-[1.5] mb-8`}
      >
        {replaceLinks(modifiedContent)}
      </div>
    </section>

    {post.tags.nodes.length > 0 && (
      <div className="my-12">
        <div className="flex flex-wrap gap-3 mt-2">
          {post.tags.nodes.map((tag) => (
            <Link
              key={tag.slug}
              href={`/${tag.slug}`}
              className="text-slate-400 text-[13px] hover:text-slate-500 transition"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>
    )}

    <div className="flex justify-between items-center border-2 border-black p-4 px-6">
      <h6
        className={`!${noto.className} !text-black !text-xs !uppercase !my-0 !font-normal`}
      >
        Spread the love
      </h6>
      <nav aria-label="Social Media Share">
        <ul className="flex justify-start items-center gap-3">
          <li>
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                postUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
            >
              <FaFacebookF className="text-slate-700 size-4 relative -top-[1px]" />
            </Link>
          </li>
          <li>
            <Link
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                postUrl
              )}&text=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Twitter"
            >
              <FaTwitter className="text-slate-700 size-4 relative -top-[1px]" />
            </Link>
          </li>
          <li>
            <Link
              href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                postUrl
              )}&media=${encodeURIComponent(
                post.featuredImage?.node.sourceUrl ||
                  `https://www.gvr.ltm.temporary.site/mower/wp-content/uploads/2025/02/load.jpg`
              )}&description=${encodeURIComponent(post.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Pinterest"
            >
              <BsPinterest className="text-slate-700 size-4 relative -top-[1px]" />
            </Link>
          </li>
        </ul>
      </nav>
    </div>

    <div className="flex justify-between items-center gap-20">
      {previousPost && (
        <div className="my-12">
          <h4
            className={`!${lato.className} !uppercase !text-slate-400 !font-normal !text-xs !tracking-widest`}
          >
            Previous Post
          </h4>
          <Link href={`/${previousPost.slug}`}>
            <div className="flex justify-center items-center gap-2 text-left">
              <GoArrowLeft className="size-3.5 relative -top-[3px]" />
              <h4 className="text-black font-medium !text-sm lg:!text-[16px] transition-all hover:!text-emerald-700">
                {previousPost.title.length > 15
                  ? `${previousPost.title.substring(0, 15)}...`
                  : previousPost.title}
              </h4>
            </div>
          </Link>
        </div>
      )}

      {nextPost && (
        <div className="my-12">
          <h4
            className={`!${lato.className} flex justify-end !uppercase !text-slate-400 !font-normal !text-xs !tracking-widest`}
          >
            Next Post
          </h4>
          <Link href={`/${nextPost.slug}`}>
            <div className="flex justify-center items-center gap-2 text-right">
              <h4 className="text-black font-medium !text-sm lg:!text-[16px] transition-all hover:!text-emerald-700">
                {nextPost.title.length > 15
                  ? `${nextPost.title.substring(0, 15)}...`
                  : nextPost.title}
              </h4>
              <GoArrowRight className="size-3.5 relative -top-[3px]" />
            </div>
          </Link>
        </div>
      )}
    </div>

    <div className="my-12">
      <h4
        className={`!${lato.className} !mb-[0.4em] !pb-[0.3em] !text-xs !tracking-[2px] !uppercase !text-[#222222]`}
      >
        About The Author
      </h4>
      <div className="border-[1px] border-slate-200 p-5">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-7">
          <div className="min-w-max">
            <Link
              href={`/${post.author?.node.slug}`}
              className="text-black font-medium"
              aria-label={`Link to ${post.author?.node.name}'s profile`}
            >
              <Image
                src={`${post.author?.node.avatar.url}`}
                alt={`${post.author?.node.name}`}
                title={`${post.author?.node.name}`}
                loading="lazy"
                width={0}
                height={0}
                className="w-20 h-20 rounded-full"
              />
            </Link>
          </div>
          <div
            className={`${poppins.className} text-center md:text-left text-sm flex-col space-y-2.5`}
          >
            <Link
              href={`/${post.author?.node.slug}`}
              className="text-black font-medium"
              aria-label={`Link to ${post.author?.node.name}'s profile`}
            >
              {post.author?.node.name}
            </Link>
            <p className={`${noto.className} text-black text-xs mt-2`}>
              {post.author?.node?.description
                ? parse(post.author.node.description)
                : "No author description available."}
            </p>
            <nav aria-label="Author Social Media">
              <ul className="flex mt-5 justify-center lg:justify-start items-center gap-3">
                {socialMediaIcons.map(({ name, icon: Icon, link }) => (
                  <li key={name}>
                    <Link
                      target="_blank"
                      href={link || "/"}
                      aria-label={`${name} profile`}
                    >
                      <Icon className="size-4 text-[#222222]" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <div className="max-w-screen-md mx-auto my-16">
      <RelatedPosts posts={post.categories.nodes[0]?.posts.nodes || []} />
    </div>

    <div className="max-w-screen-md mx-auto my-16 mb-0">
      <CommentForm postId={post.id} />
    </div>
  </article>
);

const Sidebar = () => (
  <aside className="lg:w-3/12">
    <About />
    <Newsletter />
    <Products />
    {/* <RecentPosts /> */}
  </aside>
);

export default Post;
