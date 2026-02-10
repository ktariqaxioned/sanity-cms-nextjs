import { defineType, defineField, defineArrayMember } from 'sanity'

export const footerType = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      title: 'Label',
      description: 'Label used to identify the footer in the CMS.',
      initialValue: 'Footer',
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      title: 'Subtitle',
    }),
    defineField({
      name: 'columns',
      type: 'array',
      title: 'Columns',
      description: 'Footer link columns (e.g. Company, Product, Legal).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Column Title' }),
            defineField({
              name: 'links',
              type: 'array',
              title: 'Links',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'link',
                  fields: [
                    defineField({ name: 'label', type: 'string', title: 'Label' }),
                    defineField({ name: 'href', type: 'string', title: 'URL' }),
                  ],
                  preview: {
                    select: { label: 'label' },
                    prepare({ label }) {
                      return { title: label || 'Link' }
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }) {
              return { title: title || 'Column' }
            },
          },
        }),
      ],
    }),
  ],
})
