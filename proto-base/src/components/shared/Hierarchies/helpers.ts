export function sortTree(nodes: any[]): any[] {
  const isUncategorized = (t?: string) => (t || '').trim().toLowerCase() === 'uncategorized'

  const collator = new Intl.Collator(undefined, {
    sensitivity: 'base',
    numeric: true,
  })

  const sorted = [
    // non-uncategorized nodes first
    ...nodes.filter((n) => !isUncategorized(n.title)).sort((a, b) => collator.compare(a.title ?? '', b.title ?? '')),
    // uncategorized at the end
    ...nodes.filter((n) => isUncategorized(n.title)),
  ]

  // recurse into children
  for (const node of sorted) {
    if (Array.isArray(node.children) && node.children.length) {
      node.children = sortTree(node.children)
    }
  }

  return sorted
}
