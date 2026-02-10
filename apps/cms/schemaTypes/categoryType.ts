import { defineType, defineField } from 'sanity'
import { BookOpenIcon } from 'lucide-react'

export const categoryType = defineType({
  icon: BookOpenIcon,
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: rule => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: rule => rule.required(),
    }),
  ],
})