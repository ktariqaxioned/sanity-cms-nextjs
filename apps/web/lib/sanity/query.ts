import { groq } from "next-sanity";
import { type SanityDocument } from "next-sanity";


/**
 * Common image projection used across post queries
 */
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
/**
 * Type for a post in a list (without body content)
 */
export type SanityImage = {
    asset: {
      _id: string;
      url: string;
      metadata?: {
        dimensions?: {
          width: number;
          height: number;
        };
      };
    };
  };
  
  export type Slug = {
    current: string;
  };

  export type PostListItem = SanityDocument & {
    title: string;
    slug: Slug;
    publishedAt: string;
    badges?: string[];
    author?: { name: string; avatar?: SanityImage } | null;
    categories?: { title: string }[] | null;
    tags?: { title: string }[] | null;
    image?: SanityImage;
  };

/**
 * Type for a full post (with body content)
 */
export type Post = PostListItem & {
    body?: Array<{
      _type: string;
      [key: string]: unknown;
    }>;
  };
/**
 * Type for post slug
 */
export type PostSlug = {
  slug: string;
};
