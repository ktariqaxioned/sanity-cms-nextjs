import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
    dataset: process.env.SANITY_STUDIO_DATASET!,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    appId: process.env.SANITY_STUDIO_APP_ID!,
    autoUpdates: true,
  },
  /**
   * Sanity TypeGen: generate TypeScript types from schema and GROQ queries.
   * See https://www.sanity.io/docs/apis-and-sdks/sanity-typegen
   */
  typegen: {
    path: '../web/lib/sanity/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../web/sanity.types.ts',
    overloadClientMethods: true,
  },
})
