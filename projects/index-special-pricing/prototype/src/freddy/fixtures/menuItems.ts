// Freddy mock fixture — not used in production code paths.
// UserProvider hits Application/Menu/GetMenuItemsByQuery to populate
// availablePageKeys via reducePermissionsToKeys(data?.Data). UserContext
// REPLACES scopes with this tree (setScopes({ ...availablePageKeys })), so the
// top-level keys here are exactly the modules the OSP persona can see.
//
// Strategy: derive the menu tree from createPageConfig() so every page the
// codebase declares stays in sync, then TRIM the top level to the OSP persona's
// 7 keys. Each kept module keeps its full sub-route subtree (BuyNow's
// Prompt/Forward/Offers, PricingEngine's routes, Admin's tree all intact).

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
    const data = pageToMenuNodes(cfg)
    // Freddy: a few Pricing Engine routes are gated on backend-shaped scope paths
    // that don't match where those keys land in the pageConfig-derived structural
    // tree (the real backend menu returns them flatter). Graft them so the synced
    // PE surfaces — Formula Management, Manage Quote Rows, All Prices — are
    // reachable in the prototype. pageConfig.tsx stays a faithful copy of prod.
    //   pageConfig gates: Admin.PriceEngineAdmin.{FormulaManagement,Quotes} (l.218/225),
    //                     PricingEngine.AllPrices (l.240)
    const pe = data.find((n) => n.key === 'PricingEngine')
    if (pe && !pe.routes.some((n) => n.key === 'AllPrices')) {
      pe.routes.push({ key: 'AllPrices', routes: [] })
    }
    const admin = data.find((n) => n.key === 'Admin')
    if (admin) {
      let pea = admin.routes.find((n) => n.key === 'PriceEngineAdmin')
      if (!pea) {
        pea = { key: 'PriceEngineAdmin', routes: [] }
        admin.routes.push(pea)
      }
      for (const k of ['FormulaManagement', 'Quotes']) {
        if (!pea.routes.some((n) => n.key === k)) pea.routes.push({ key: k, routes: [] })
      }
    }

    // --- OSP persona trim ---
    // Keep only the 7 top-level keys the OSP user has. Order preserved to match
    // the pageConfig declaration order (= sidebar order). Sub-routes are kept
    // as-is. "SpecialOffers" is the Manage Offers module (relabelled in
    // pageConfig.tsx); "Current Prices" lives inside the kept "Admin" subtree.
    const OSP_KEYS = [
      'OrderDashboard',
      'AdminDashboard',
      'SpecialOffers',
      'OnlineOrders',
      'BuyNow',
      'PricingEngine',
      'Admin',
    ]
    const ospData = OSP_KEYS.map((k) => data.find((n) => n.key === k)).filter(
      (n): n is MenuNode => Boolean(n)
    )

    cached = { Data: ospData }
  }
  return cached
}

export const menuItemsFixture = new Proxy({} as { Data: MenuNode[] }, {
  get(_t, prop) {
    return (build() as any)[prop]
  },
})
