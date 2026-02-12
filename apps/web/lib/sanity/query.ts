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
  author->{ name, avatar, slug },
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

/**
 * Avatar projection for author queries
 */
// @sanity-typegen-ignore
const AVATAR_PROJECTION = groq`
  avatar{
    asset->{
      _id,
      url,
      metadata{ dimensions{ width, height } }
    }
  }
`;

/**
 * Query to fetch a single author by slug
 */
export const AUTHOR_BY_SLUG_QUERY = groq`
  *[_type == "author" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    bio,
    ${AVATAR_PROJECTION}
  }
`;

/**
 * Query to fetch all author slugs for static generation
 */
export const AUTHOR_SLUGS_QUERY = groq`
  *[_type == "author" && defined(slug.current)]{
    "slug": slug.current
  }
`;

/**
 * Query to fetch posts by author slug
 */
export const POSTS_BY_AUTHOR_SLUG_QUERY = groq`
  *[
    _type == "post" &&
    defined(slug.current) &&
    author->slug.current == $slug
  ]
  | order(publishedAt desc)[0...20]{
    ${POST_BASE_PROJECTION}
  }
`;

// Re-export generated TypeGen result types for convenience
export type {
  POSTS_QUERY_RESULT,
  POST_BY_SLUG_QUERY_RESULT,
  POST_SLUGS_QUERY_RESULT,
} from "@/lib/sanity/sanity.types";
