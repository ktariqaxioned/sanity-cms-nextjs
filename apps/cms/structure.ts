import type { StructureBuilder } from 'sanity/structure'
import type { LucideIcon } from 'lucide-react'
import { Menu, PanelBottom, Settings2, SlidersHorizontal } from 'lucide-react'

const SITE_CONFIG_TYPES = ['navbar', 'footer', 'settings']

/**
 * Creates a singleton list item that opens the single document with documentId = type.
 */
function createSingleton(
  S: StructureBuilder,
  options: {
    type: string
    title: string
    icon?: LucideIcon
  }
) {
  const { type, title, icon } = options
  const item = S.listItem()
    .title(title)
    .child(
      S.document()
        .schemaType(type)
        .documentId(type)
    )
  return icon ? item.icon(icon) : item
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
        .icon(SlidersHorizontal)
        .child(
          S.list()
            .title('Site Configuration')
            .items([
              createSingleton(S, { type: 'navbar', title: 'Navigation', icon: Menu }),
              createSingleton(S, { type: 'footer', title: 'Footer', icon: PanelBottom }),
              createSingleton(S, { type: 'settings', title: 'Global Settings', icon: Settings2 }),
            ])
        ),
      
    ])
}
