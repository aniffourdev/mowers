import { gql } from "graphql-request";
import { client } from "@/api/graphql/client";

export interface Post {
  id: string;
  title: string;
  date: string;
  content: string;
  seo: {
    metaDesc: string;
    title: string;
    opengraphPublishedTime: string;
    opengraphModifiedTime: string;
  };
  slug: string;
  author: {
    node: {
      name: string;
    };
  };
  categories: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
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
    nodes: Post[];
  };
}


  /* ----------------------------------------  RECENT POSTS START  ----------------------------------------- */

  const RecenetPosts = gql`
  query GetRecentPosts {
    posts(first: 5, where: { status: PUBLISH }) {
      nodes {
        id
        title
        content
        slug
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
            title
          }
        }
        seo {
          metaDesc
          title
          opengraphPublishedTime
          opengraphModifiedTime
        }
      }
    }
  }
`;

// Recent Posts
export async function recent_posts(): Promise<Post[]> {
  try {
    const data = await client.request<PostsQueryResult>(RecenetPosts);
    return data.posts.nodes;
  } catch {
    return [];
  }
}
  
  /* ----------------------------------------  END OF RECENT POSTS  ----------------------------------------- */

// Featured Articles Queries
const FeaturedArticles = gql`
  query GetPosts {
    posts(first: 6, where: { status: PUBLISH }) {
      nodes {
        id
        title
        content
        date
        slug
        author {
          node {
            name
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
            title
          }
        }
        seo {
          metaDesc
          title
          opengraphPublishedTime
          opengraphModifiedTime
        }
      }
    }
  }
`;
// Featured Articles Function
export async function featured_articles(): Promise<Post[]> {
  try {
    const data = await client.request<PostsQueryResult>(FeaturedArticles);
    return data.posts.nodes;
  } catch {
    return [];
  }
}
