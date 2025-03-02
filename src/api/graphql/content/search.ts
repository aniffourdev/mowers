// api/graphql/search.ts
import { request } from "graphql-request";
import { SEARCH_POSTS } from "@/api/graphql/queries/searchPosts";

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
    } | null;
  } | null;
}

export interface SearchResponse {
  posts: {
    nodes: SearchResult[];
  };
}

export async function searchPosts(searchTerm: string): Promise<SearchResult[]> {
  const endpoint = `${process.env.NEXT_PUBLIC_ENDPOINT}/graphql`;

  try {
    const data = await request<SearchResponse>(endpoint, SEARCH_POSTS, {
      searchTerm,
    });

    return data.posts.nodes;
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}
