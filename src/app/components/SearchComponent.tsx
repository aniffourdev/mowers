"use client";
import { searchPosts, SearchResult } from "@/api/graphql/content/search";
import Link from "next/link";
import React from "react";
import { LuSearch } from "react-icons/lu";
import Image from "next/image";
import { Lato, Noto_Sans, Poppins } from "next/font/google";

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
      <form
        onSubmit={handleSearchSubmit}
        className="w-full max-w-2xl mx-auto mb-8"
      >
        <h2
          className={`${noto.className} text-[#333333] text-[10px] font-[400] mb-4 text-center tracking-wide uppercase`}
        >
          Search Here
        </h2>
        <div className="flex w-full">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="type and hit enter"
            className={`${poppins.className} w-full p-4 font-bold text-3xl placeholder:text-slate-200 outline-none bg-transparent`}
            aria-label="type and hit enter"
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
              className={`size-6 ${isSearching ? "animate-pulse" : ""}`}
            />
          </button>
        </div>
      </form>

      {/* Search Results */}
      <div className="w-full max-w-4xl mx-auto flex-1 overflow-y-auto">
        {isSearching ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {searchResults.map((result) => (
              <Link
                href={`/${result.slug}`}
                key={result.id}
                onClick={onClose}
                className="block group hover:bg-gray-100 p-4 rounded-lg transition-colors"
              >
                <article className="flex flex-col h-full">
                  <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                    {result.featuredImage?.node ? (
                      <Image
                        src={result.featuredImage.node.sourceUrl}
                        alt={result.featuredImage.node.altText || result.title}
                        className="object-cover transition-transform group-hover:scale-105"
                        fill
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                        <LuSearch className="size-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                    {result.title}
                  </h3>
                  {result.excerpt && (
                    <p className="text-gray-600 text-sm mb-2">
                      {stripHtml(result.excerpt).substring(0, 120)}
                      {stripHtml(result.excerpt).length > 120 ? "..." : ""}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 mt-auto">
                    {new Date(result.date).toLocaleDateString()}
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : searchTerm && !isSearching ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No results found for "{searchTerm}"
            </p>
            <p className="mt-2 text-gray-500">
              Try different keywords or check your spelling
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchComponent;
