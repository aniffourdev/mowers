import { gql } from "@apollo/client";
import client from "@/api/apollo/client";

// Define the type for the nodes
interface NodeWithSlug {
  slug: string;
}

export async function getAllSlugs() {
  const { data } = await client.query({
    query: gql`
      query GetAllSlugs {
        categories(first: 100) {
          nodes {
            slug
          }
        }
        pages(first: 100) {
          nodes {
            slug
          }
        }
        posts(first: 100) {
          nodes {
            slug
          }
        }
        tags(first: 100) {
          nodes {
            slug
          }
        }
      }
    `,
  });

  return [
    ...data.categories.nodes.map((n: NodeWithSlug) => n.slug),
    ...data.pages.nodes.map((n: NodeWithSlug) => n.slug),
    ...data.posts.nodes.map((n: NodeWithSlug) => n.slug),
    ...data.tags.nodes.map((n: NodeWithSlug) => `tag/${n.slug}`), // Prefix tag slugs with 'tag/'
  ];
}

export async function getContentBySlug(slug: string) {
  const { data } = await client.query({
    query: gql`
      query GetContentBySlug($slug: ID!) {
        category(id: $slug, idType: SLUG) {
          id
          name
          slug
          categoryImage
          description
          posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              title
              slug
              content
              date
              seo {
                readingTime
                metaDesc
                opengraphPublishedTime
              }
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
            }
          }
          children {
            nodes {
              name
              slug
              description
              posts {
                nodes {
                  title
                  date
                  slug
                  content
                  featuredImage {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                }
              }
            }
          }
        }

        page(id: $slug, idType: URI) {
          id
          title
          content
          slug
        }

        post(id: $slug, idType: SLUG) {
          id
          title
          content
          slug
          author {
            node {
              name
              avatar {
                url
              }
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
            readingTime
          }
          categories {
            nodes {
              name
              slug
            }
          }
          tags {
            nodes {
              name
              slug
            }
          }
        }

        tag(id: $slug, idType: SLUG) {
          id
          name
          slug
          posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
            nodes {
              title
              slug
              categories {
                nodes {
                  name
                  slug
                }
              }
              content
              date
              seo {
                readingTime
                metaDesc
                opengraphPublishedTime
              }
              featuredImage {
                node {
                  sourceUrl
                  altText
                }
              }
            }
          }
        }
      }
    `,
    variables: { slug },
  });

  if (data.category) return { ...data.category, type: "category" };
  if (data.page) return { ...data.page, type: "page" };
  if (data.post) return { ...data.post, type: "post" };
  if (data.tag) return { ...data.tag, type: "tag" }; // Return tag data

  return null;
}
