interface GroupLike {
  QuoteConfigurationMappingGroupId: string | number
  GroupName: string | null
}

const OTHER_GROUP: GroupLike = { QuoteConfigurationMappingGroupId: '-1', GroupName: 'Other' }

export function getOrderedGroups(groups: GroupLike[] | undefined, tabOrder: string[]): GroupLike[] {
  if (!groups) return []

  const namedGroups = groups.filter((g) => g.GroupName)
  const allGroups = [...namedGroups, OTHER_GROUP]

  if (!tabOrder || tabOrder.length === 0) return allGroups

  const groupMap = new Map(allGroups.map((g) => [String(g.QuoteConfigurationMappingGroupId), g]))
  const ordered = tabOrder.filter((id) => groupMap.has(id)).map((id) => groupMap.get(id)!)

  const orderedSet = new Set(tabOrder)
  const newGroups = allGroups.filter((g) => !orderedSet.has(String(g.QuoteConfigurationMappingGroupId)))

  return [...ordered, ...newGroups]
}

export function reorderList(list: string[], fromId: string, toId: string): string[] {
  const fromIndex = list.indexOf(fromId)
  const toIndex = list.indexOf(toId)

  if (fromIndex === -1 || toIndex === -1) return list

  const reordered = [...list]
  reordered.splice(fromIndex, 1)
  reordered.splice(toIndex, 0, fromId)

  return reordered
}
