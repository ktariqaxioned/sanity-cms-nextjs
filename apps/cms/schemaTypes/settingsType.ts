import { defineType, defineField } from 'sanity'

export const settingsType = defineType({
  name: 'settings',
  title: 'Global Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'label',
      type: 'string',
      title: 'Label',
      description: 'Label used to identify settings in the CMS.',
      initialValue: 'Global Settings',
    }),
    defineField({
      name: 'siteTitle',
      type: 'string',
      title: 'Site Title',
      description: 'The main title of your website, used in browser tabs and SEO.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'siteDescription',
      type: 'text',
      title: 'Site Description',
      description: 'A brief description of your website for SEO purposes.',
    }),
  ],
})
