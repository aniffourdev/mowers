"use client";
import { searchPosts, SearchResult } from "@/api/graphql/content/search";
import Link from "next/link";
import React from "react";
import { LuSearch } from "react-icons/lu";
import Image from "next/image";
import { Lato, Noto_Sans, Poppins } from "next/font/google";
import { IoMdClose } from "react-icons/io";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});
const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });
const noto = Noto_Sans({ weight: "400", subsets: ["latin"] });

interface SearchComponentProps {
  onClose: () => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      return;
    }

    setIsSearching(true);

    try {
      const results = await searchPosts(searchTerm);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Strip HTML from excerpt
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div className="max-w-screen-xl mx-auto mt-20">
      <div className="flex justify-end items-end px-5" onClick={onClose}>
        <IoMdClose className="size-6 text-slate-700 cursor-pointer" />
      </div>
      <form
        onSubmit={handleSearchSubmit}
        className="w-full max-w-2xl mx-auto mb-8"
      >
        <h2
          className={`${noto.className} text-[#333333] !text-[10px] font-[400] mb-4 text-center tracking-wide uppercase`}
        >
          Search Here
        </h2>
        <div className="flex w-full">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="search here..."
            className={`${poppins.className} w-full p-4 font-bold text-3xl placeholder:text-slate-200 outline-none bg-transparent`}
            aria-label="search here..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            type="submit"
            className="ml-2 p-4 text-xl"
            aria-label="Submit search"
            disabled={isSearching}
          >
            <LuSearch
              className={`size-6 cursor-pointer ${isSearching ? "animate-pulse" : ""}`}
            />
          </button>
        </div>
      </form>

      {/* Search Results */}
      <div className="max-w-screen-lg mx-auto p-4 my-10 overflow-y-auto">
        {isSearching ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-7">
            {searchResults.map((result) => (
              <article key={result.slug} className="mb-6">
              <div className="">
                {result.featuredImage?.node ? (
                  <figure className="mb-3">
                    <Link
                      href={`/${result.slug}`}
                      aria-label={`View post: ${result.title}`}
                      onClick={onClose}
                    >
                      <Image
                        src={
                          result.featuredImage?.node?.sourceUrl ||
                          `https://gvr.ltm.temporary.site/mower//wp-content/uploads/2025/02/load.jpg`
                        }
                        alt={
                          result.featuredImage.node.altText || result.title
                        }
                        title={
                          result.featuredImage?.node?.title || result.title
                        }
                        loading="lazy"
                        width={400}
                        height={280}
                        className="w-full h-auto"
                      />
                    </Link>
                  </figure>
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <LuSearch className="size-8 text-gray-800" />
                  </div>
                )}
              </div>
              <Link
                href={`/${result.slug}`}
                aria-label={`View post: ${result.title}`}
              >
                <h3
                  className={`!text-black !text-xs md:!text-sm !uppercase`}
                >
                  {result.title.length > 30
                    ? `${result.title.substring(0, 30)}...`
                    : result.title}
                </h3>
              </Link>
              <div className="flex justify-start items-start md:items-center gap-2 md:gap-4 mb-3.5 mt-2 flex-col md:flex-row">
                {result.categories.nodes.length > 0 && (
                  <Link
                    href={`/${result.categories.nodes[0].slug}`}
                    className={`py-0.5 pt-[3px] px-1.5 text-black text-[10px] tracking-[1px] uppercase border-black border-[1px] transition-all hover:text-white hover:bg-black`}
                  >
                    {result.categories.nodes[0].name}
                  </Link>
                )}
                <time
                  dateTime={result.seo.opengraphPublishedTime}
                  className="text-slate-700 text-[10px] md:text-xs uppercase"
                >
                  {new Date(
                    result.seo.opengraphPublishedTime
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>
              <p className="text-slate-700 text-xs">
                {result.seo.metaDesc.length > 70
                  ? `${result.seo.metaDesc.substring(0, 70)}...`
                  : result.seo.metaDesc}
              </p>
            </article>
            ))}
          </div>
        ) : searchTerm && !isSearching ? (
          <></>
        ) : null}
      </div>
    </div>
  );
};

export default SearchComponent;
