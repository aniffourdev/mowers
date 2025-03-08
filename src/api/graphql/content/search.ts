// api/graphql/search.ts
import { request } from "graphql-request";
import { SEARCH_POSTS } from "@/api/graphql/queries/searchPosts";

export interface SearchResult {
  categories: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
  seo: {
    metaDesc: string;
    title: string;
    opengraphPublishedTime: string;
    opengraphModifiedTime: string;
  };
  content: string;
  id: string;
  title: string;
  slug: string;
  date: string;
  featuredImage: {
    node: {
      sourceUrl: string;
      altText: string;
      title: string;
    };
  } | null;
}

interface PostsQueryResult {
  posts: {
    nodes: SearchResult[];
  };
}

export async function searchPosts(searchTerm: string): Promise<SearchResult[]> {
  const endpoint = `${process.env.NEXT_PUBLIC_ENDPOINT}/graphql`;

  try {
    const data = await request<PostsQueryResult>(endpoint, SEARCH_POSTS, {
      searchTerm,
    });

    return data.posts.nodes;
  } catch (error) {
    console.error("Error searching posts:", error);
    return [];
  }
}
