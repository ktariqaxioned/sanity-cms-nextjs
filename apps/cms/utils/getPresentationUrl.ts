import {defineDocuments, defineLocations} from 'sanity/presentation'

export const mainDocuments = defineDocuments([
  {
    route: '/posts/:slug',
    filter: `_type == "post" && slug.current == $slug`,
  },
  {
    route: '/authors/:slug',
    filter: `_type == "author" && slug.current == $slug`,
  },
])

export const locations = {
  post: defineLocations({
    select: {title: 'title', slug: 'slug.current'},
    resolve: (doc) => ({
      locations: doc?.slug
        ? [{title: doc?.title || 'Post', href: `/posts/${doc.slug}`}]
        : [],
    }),
  }),
  author: defineLocations({
    select: {name: 'name', slug: 'slug.current'},
    resolve: (doc) => ({
      locations: doc?.slug
        ? [{title: doc?.name || 'Author', href: `/authors/${doc.slug}`}]
        : [],
    }),
  }),
}