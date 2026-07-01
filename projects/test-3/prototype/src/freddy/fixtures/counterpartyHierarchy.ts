// Freddy mock fixture — fictional
// /Admin/CounterpartyHierarchy uses three endpoints:
//   - .../List  → HierarchyListItem[] (bare array)
//   - .../Get   → tree { key, title, children }[] for TreeView
//   - .../Items → HierarchyItemsResponse { Level, BreadCrumbs, ChildrenKeys, SiblingKeys }
// CounterPartyId references (9001-9010) are kept stable with counterparties.ts.

export const counterpartyHierarchyListFixture: Array<{
  Key: number
  Name: string
  Levels: string[]
}> = [
  { Key: 1, Name: 'Sales Region Hierarchy', Levels: ['Region', 'District', 'Counterparty'] },
  { Key: 2, Name: 'Credit Tier Hierarchy', Levels: ['Tier', 'Counterparty'] },
  { Key: 3, Name: 'Channel Hierarchy', Levels: ['Channel', 'Sub-Channel', 'Counterparty'] },
]

export const counterpartyHierarchyGetFixture: Array<{
  key: number
  title: string
  children: Array<{ key: number; title: string; children?: any[] }>
}> = [
  {
    key: 1001,
    title: 'West Region',
    children: [
      {
        key: 1101,
        title: 'Pacific District',
        children: [
          { key: 9003, title: 'Cascade Logistics LLC', children: [] },
          { key: 9007, title: 'Northstar Distribution', children: [] },
        ],
      },
      {
        key: 1102,
        title: 'Mountain District',
        children: [
          { key: 9005, title: 'Summit Energy Partners', children: [] },
          { key: 9008, title: 'Mesa Fuel Marketing', children: [] },
        ],
      },
    ],
  },
  {
    key: 1002,
    title: 'Central Region',
    children: [
      {
        key: 1201,
        title: 'Gulf District',
        children: [
          { key: 9001, title: 'Demo Refining Inc.', children: [] },
          { key: 9006, title: 'Bayou Petroleum Group', children: [] },
          { key: 9010, title: 'Riverbend Refiners', children: [] },
        ],
      },
      {
        key: 1202,
        title: 'Plains District',
        children: [
          { key: 9002, title: 'Frontier Fuel Services', children: [] },
          { key: 9004, title: 'Prairie Trading Co.', children: [] },
          { key: 9009, title: 'Atlas Bulk Carriers', children: [] },
        ],
      },
    ],
  },
]

export const counterpartyHierarchyItemsFixture = {
  Level: 'District',
  BreadCrumbs: ['Central Region', 'Gulf District'],
  ChildrenKeys: [9001, 9006, 9010],
  SiblingKeys: [1201, 1202],
}
