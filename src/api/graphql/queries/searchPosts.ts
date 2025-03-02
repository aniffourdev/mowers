// 1. First, let's create a GraphQL query for search in api/queries/searchPosts.ts

// api/queries/searchPosts.ts
import { gql } from "graphql-request";

export const SEARCH_POSTS = gql`
  query SearchPosts($searchTerm: String!) {
    posts(where: { search: $searchTerm }, first: 10) {
      nodes {
        id
        title
        slug
        date
        excerpt
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;
