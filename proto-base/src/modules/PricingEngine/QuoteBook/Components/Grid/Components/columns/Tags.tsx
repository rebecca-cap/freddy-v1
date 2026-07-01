import { BBDTag, Horizontal, ManyTag } from '@gravitate-js/excalibrr'
import type { QuoteBookMetadataResponse } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import type { ColDef } from 'ag-grid-community'

const untaggedFilterKey = '(Untagged)'
const untaggedGroupKey = '__UNTAGGED__'
const tagIdsKeyPattern = /^\d+(,\d+)*$/

type QuoteRowTagsMetadata = QuoteBookMetadataResponse['QuoteRowTags']

const buildTagIndex = (quoteRowTags: QuoteRowTagsMetadata) => {
  const tagsById = new Map<number, string>()
  for (const item of quoteRowTags ?? []) {
    const id = Number(item.Value)
    const name = item.Text
    if (!Number.isFinite(id) || !name) continue
    tagsById.set(id, name)
  }
  return { tagsById }
}

export const Tags = ({ quoteRowTags }: { quoteRowTags?: QuoteRowTagsMetadata }): ColDef => {
  const { tagsById } = buildTagIndex(quoteRowTags)
  const getTagName = (id: number) => tagsById.get(id) ?? ''

  return {
    field: 'AssignedQuoteRowTagIds',
    headerName: 'Tags',
    minWidth: 220,
    editable: false,
    autoHeight: true,
    enableRowGroup: true,
    valueGetter: ({ data }) => data?.AssignedQuoteRowTagIds ?? [],
    cellRenderer: ({ value }: { value: number[] | null }) => {
      if (!Array.isArray(value) || value.length === 0) return null
      const tagItems = value
        .map(getTagName)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))
      return <ManyTag tagItems={tagItems} maxCount={3} />
    },
    comparator: (valueA: unknown, valueB: unknown) => {
      const project = (v: unknown): { count: number; names: string } => {
        if (Array.isArray(v)) {
          const names = v
            .map((id) => getTagName(Number(id)))
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))
            .join(',')
          return { count: v.length, names: names.toLowerCase() }
        }
        if (typeof v === 'string' && tagIdsKeyPattern.test(v)) {
          const ids = v.split(',').map(Number)
          const names = ids
            .map((id) => getTagName(id))
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))
            .join(',')
          return { count: ids.length, names: names.toLowerCase() }
        }
        return { count: 0, names: '' }
      }
      const a = project(valueA)
      const b = project(valueB)
      if (a.count !== b.count) return a.count - b.count
      return a.names.localeCompare(b.names)
    },
    filter: 'agSetColumnFilter',
    filterValueGetter: (params) => {
      const ids: number[] = params.data?.AssignedQuoteRowTagIds ?? []
      return ids.length === 0 ? [untaggedFilterKey] : ids
    },
    filterParams: {
      valueFormatter: (params: { value: number | string }) => {
        if (params.value === untaggedFilterKey) return untaggedFilterKey
        return getTagName(Number(params.value))
      },
    },
    keyCreator: ({ value }: { value: number[] | null }) => {
      if (!Array.isArray(value) || value.length === 0) return untaggedGroupKey
      return [...value].sort((a, b) => a - b).join(',')
    },
  }
}

export const quoteBookTagsGroupInnerRenderer =
  ({ quoteRowTags }: { quoteRowTags?: QuoteRowTagsMetadata }) =>
  (params: { value?: string }) => {
    const key = params.value ?? ''
    if (key === untaggedGroupKey) return '(No Tags)'
    if (!tagIdsKeyPattern.test(key)) return key

    const { tagsById } = buildTagIndex(quoteRowTags)
    const names = key
      .split(',')
      .map((idStr) => tagsById.get(Number(idStr)) ?? '')
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b))

    if (names.length === 0) return '(No Tags)'

    return (
      <Horizontal verticalCenter style={{ gap: 4, flexWrap: 'wrap' }}>
        {names.map((name) => (
          <BBDTag key={name}>{name}</BBDTag>
        ))}
      </Horizontal>
    )
  }
