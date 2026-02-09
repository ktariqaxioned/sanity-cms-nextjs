import {defineArrayMember, defineField, defineType} from 'sanity'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'badges',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'string',
          options: {
            list: [
              { title: 'Featured', value: 'featured' },
              { title: 'New', value: 'new' },
              { title: 'Popular', value: 'popular' },
              { title: 'Trending', value: 'trending' },
              { title: 'Editor\'s Pick', value: 'editors-pick' },
              { title: 'Technology', value: 'technology' },
              { title: 'Science', value: 'science' },
              { title: 'Health', value: 'health' },
              { title: 'Business', value: 'business' },
              { title: 'Education', value: 'education' },
              { title: 'Entertainment', value: 'entertainment' },
              { title: 'News', value: 'news' },
              { title: 'Sports', value: 'sports' },
              { title: 'Travel', value: 'travel' },
              { title: 'Food', value: 'food' },
              { title: 'Fashion', value: 'fashion' },
              { title: 'Art', value: 'art' },
              { title: 'Music', value: 'music' },
              { title: 'Movies', value: 'movies' },
              { title: 'TV', value: 'tv' },
              { title: 'Books', value: 'books' },
              { title: 'Politics', value: 'politics' },
              { title: 'Environment', value: 'environment' },
              { title: 'Comics', value: 'comics' },
              { title: 'Games', value: 'games' },
              { title: 'Other', value: 'other' },
            ],
          },
        }),
      ],
    }),
  ],
})