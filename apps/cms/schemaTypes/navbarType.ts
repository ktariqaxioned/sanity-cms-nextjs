import { defineType, defineField, defineArrayMember } from 'sanity'

export const navbarType = defineType({
  name: 'navbar',
  title: 'Navbar',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      title: 'Label',
      description: 'Label used to identify this navigation in the CMS.',
      initialValue: 'Navbar',
    }),
    defineField({
      name: 'menu',
      type: 'array',
      title: 'Menu',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'menuItem',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label', validation: (rule) => rule.required() }),
            defineField({ name: 'href', type: 'string', title: 'URL', validation: (rule) => rule.required() }),
          ],
          preview: {
            select: { label: 'label' },
            prepare({ label }) {
              return { title: label || 'Menu item' }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'ctaButton',
      type: 'object',
      title: 'CTA Button',
      fields: [
        defineField({ name: 'label', type: 'string', title: 'Label' }),
        defineField({ name: 'href', type: 'string', title: 'URL' }),
      ],
    }),
  ],
})
