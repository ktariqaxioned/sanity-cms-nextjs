import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {locations, mainDocuments} from './utils/getPresentationUrl'
import {presentationTool} from 'sanity/presentation'

export default defineConfig({
  name: process.env.SANITY_STUDIO_NAME!,
  title: process.env.SANITY_STUDIO_TITLE!,

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  plugins: [
    presentationTool({
      previewUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://sanity-cms-nextjs-web.vercel.app',
      resolve: {locations, mainDocuments},
    }),
    structureTool({structure}),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
