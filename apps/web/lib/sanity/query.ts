import { groq } from "next-sanity";

/**
 * Common image projection used across post queries
 */
// @sanity-typegen-ignore
const IMAGE_PROJECTION = groq`
  image{
    asset->{
      _id,
      url,
      metadata{
        dimensions{
          width,
          height
        }
      }
    }
  }
`;

/**
 * Base fields shared by all post queries
 */
// @sanity-typegen-ignore
const POST_BASE_PROJECTION = groq`
  _id,
  title,
  slug,
  publishedAt,
  badges,
  author->{ name, avatar },
  categories[]->{ title },
  tags[]->{ title },
  ${IMAGE_PROJECTION}
`;

/**
 * Query to fetch a list of posts
 * Returns posts ordered by published date (newest first)
 */
export const POSTS_QUERY = groq`
  *[
    _type == "post" &&
    defined(slug.current)
  ]
  | order(publishedAt desc)[0...12]{
    ${POST_BASE_PROJECTION}
  }
`;

/**
 * Query to fetch a single post by slug
 * Returns full post details including body content
 */
export const POST_BY_SLUG_QUERY = groq`
  *[
    _type == "post" &&
    slug.current == $slug
  ][0]{
    ${POST_BASE_PROJECTION},
    body
  }
`;

/**
 * Query to fetch all post slugs for static generation
 */
export const POST_SLUGS_QUERY = groq`
  *[
    _type == "post" &&
    defined(slug.current)
  ]{
    "slug": slug.current
  }
`;

// Re-export generated TypeGen result types for convenience
export type {
  POSTS_QUERY_RESULT,
  POST_BY_SLUG_QUERY_RESULT,
  POST_SLUGS_QUERY_RESULT,
} from "@/sanity.types";
