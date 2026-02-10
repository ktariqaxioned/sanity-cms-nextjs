import type { StructureBuilder } from 'sanity/structure'

const SITE_CONFIG_TYPES = ['navbar', 'footer', 'settings']

/**
 * Creates a singleton list item that opens the single document with documentId = type.
 */
function createSingleton(
  S: StructureBuilder,
  options: {
    type: string
    title: string
  }
) {
  const { type, title } = options
  return S.listItem()
    .title(title)
    .child(
      S.document()
        .schemaType(type)
        .documentId(type)
    )
}

export function structure(S: StructureBuilder) {
  const defaultDocTypes = S.documentTypeListItems().filter(
    (item) => !SITE_CONFIG_TYPES.includes(item.getId() ?? '')
  )

  return S.list()
    .title('Content')
    .items([
      ...defaultDocTypes,
      S.divider(),
      S.listItem()
        .title('Site Configuration')
        .child(
          S.list()
            .title('Site Configuration')
            .items([
              createSingleton(S, { type: 'navbar', title: 'Navigation' }),
              createSingleton(S, { type: 'footer', title: 'Footer' }),
              createSingleton(S, { type: 'settings', title: 'Global Settings' }),
            ])
        ),
      
    ])
}
