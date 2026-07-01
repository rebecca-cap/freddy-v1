// Freddy mock fixture — not used in production code paths.
// UserProvider hits Application/Menu/GetMenuItemsByQuery to populate
// availablePageKeys via reducePermissionsToKeys(data?.Data).
//
// Strategy: derive the menu tree from createPageConfig() so every page
// the codebase declares is automatically granted. Sub-routes are walked
// recursively. This keeps the fixture in sync with real pageConfig.tsx
// without hand-maintaining a 70+ key list.

import { createPageConfig } from '@modules/pageConfig'

type MenuNode = { key: string; routes: MenuNode[] }

function pageToMenuNodes(pages: Record<string, any>): MenuNode[] {
  return Object.values(pages).map((page: any) => ({
    key: page.key,
    routes: Array.isArray(page.routes)
      ? page.routes.map((r: any) => ({
          key: r.key,
          routes: Array.isArray(r.routes) ? pageToMenuNodes(arrToRecord(r.routes)) : [],
        }))
      : [],
  }))
}

function arrToRecord(arr: any[]): Record<string, any> {
  return arr.reduce((acc: Record<string, any>, p: any) => {
    if (p?.key) acc[p.key] = p
    return acc
  }, {})
}

// Lazy generation so we only run this once when the fixture is first read.
let cached: { Data: MenuNode[] } | null = null
function build(): { Data: MenuNode[] } {
  if (!cached) {
    const cfg = createPageConfig()
    cached = { Data: pageToMenuNodes(cfg) }
  }
  return cached
}

export const menuItemsFixture = new Proxy({} as { Data: MenuNode[] }, {
  get(_t, prop) {
    return (build() as any)[prop]
  },
})
