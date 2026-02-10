import { defineType, defineField } from 'sanity'
import { TagIcon } from 'lucide-react'

export const tagType = defineType({
  icon: TagIcon,
  name: 'tag',
  title: 'Tag',
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