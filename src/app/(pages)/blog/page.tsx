import { gql } from "@apollo/client";
import client from "@/api/apollo/client";
import BlogPosts from "@/app/components/pages/blog/Blog";
import { Metadata } from "next";
import { Lato, Poppins } from "next/font/google";

const lato = Lato({ weight: ["100", "300", "400", "700"], subsets: ["latin"] });
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Blog",
    template: "%s | Bkmower",
  },
  description:
    "Get expert tire maintenance tips and wheel guides from our automotive blog. Learn about pressure, sizing, and safety to maximize your vehicle's performance.",
  openGraph: {
    title: "Blog | Bkmower",
    description:
      "Get expert tire maintenance tips and wheel guides from our automotive blog. Learn about pressure, sizing, and safety to maximize your vehicle's performance.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Define types for the data returned by the GraphQL query
interface Post {
  id: string;
  date: string;
  title: string;
  categories: {
    nodes: {
      name: string;
      slug: string;
    }[];
  };
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      title: string;
    };
  };
  seo: {
    metaDesc: string;
    opengraphPublishedTime: string;
  };
  slug: string;
}

interface QueryResult {
  posts: {
    edges: {
      node: Post;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

const GET_INITIAL_POSTS = gql`
  query GetInitialPosts {
    posts(first: 9, where: { status: PUBLISH }) {
      edges {
        node {
          id
          date
          title
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
            opengraphPublishedTime
          }
          slug
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export default async function BlogPage() {
  const { data } = await client.query<QueryResult>({
    query: GET_INITIAL_POSTS,
  });

  return (
    <section
      className="max-w-screen-lg mx-auto p-4 my-10"
      aria-label="Blog Page"
    >
      <div className="flex justify-center items-center flex-col">
        <h1 className={`${poppins.className} uppercase text-4xl font-bold mb-3.5`}>Blog</h1>
        <p className={`${lato.className} text-slate-600 text-center max-w-[600px]`}>
          Your go-to blog for tire tips, guides, and updates. Explore expert
          advice on tire pressure, sizes, and wheels to keep your vehicle safe
          and performing at its best.
        </p>
      </div>
      <BlogPosts
        initialPosts={data.posts.edges.map((edge) => edge.node)}
        initialHasNextPage={data.posts.pageInfo.hasNextPage}
        initialEndCursor={data.posts.pageInfo.endCursor}
      />
    </section>
  );
}
