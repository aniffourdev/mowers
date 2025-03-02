import { gql } from "graphql-request";
import { client } from "@/api/graphql/client";

export interface Category {
  id: string;
  name: string;
  slug: string;
  categoryImage: string;
  content: string;
  seo: {
    metaDesc: string;
    title: string;
    opengraphPublishedTime: string;
    opengraphModifiedTime: string;
  };
  posts: {
    nodes: {
      slug: string;
      title: string;
      date: string;
      content: string;
    }[];
  };
}

interface CategoriesQueryResult {
  categories: {
    nodes: Category[];
  };
}

const GET_CATEGORIES = gql`
  query GetTopLevelCategories {
    categories(where: { parent: null }) {
      nodes {
        id
        name
        categoryImage
        slug
        posts {
          nodes {
            slug
            date
            title
            content
          }
        }
      }
    }
  }
`;

export async function getCategories(
  categoryNames: string[]
): Promise<Category[]> {
  try {
    const data = await client.request<CategoriesQueryResult>(GET_CATEGORIES);
    const allCategories = data.categories.nodes;

    // Filter categories by the provided names
    return allCategories.filter((category) =>
      categoryNames.includes(category.name)
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
