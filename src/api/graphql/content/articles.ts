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

const BLOCK_4 = gql`
  query GetPosts {
    posts(
      first: 6
      where: {
        orderby: { field: DATE, order: DESC }
        categoryName: "Tires Size"
        status: PUBLISH
      }
    ) {
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

// Tires Pressure Posts
export async function block_4_articles(): Promise<Post[]> {
  try {
    const data = await client.request<PostsQueryResult>(BLOCK_4);
    return data.posts.nodes;
  } catch {
    return [];
  }
}

// Wheel Tires Queries
const WheelTires = gql`
  query GetPosts {
    posts(
      first: 6
      where: {
        orderby: { field: DATE, order: DESC }
        categoryName: "Wheel Tires"
        status: PUBLISH
      }
    ) {
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

// Wheel Tires Posts
export async function wheel_tires_articles(): Promise<Post[]> {
  try {
    const data = await client.request<PostsQueryResult>(WheelTires);
    return data.posts.nodes;
  } catch {
    return [];
  }
}

{
  /* ----------------------------------------  FEATURED ARTICLES  ----------------------------------------- */
}

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
