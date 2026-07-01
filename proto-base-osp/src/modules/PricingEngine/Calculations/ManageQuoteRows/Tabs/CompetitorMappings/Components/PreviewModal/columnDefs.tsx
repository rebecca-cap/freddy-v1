import { BBDTag } from '@gravitate-js/excalibrr'
import type { ColDef } from 'ag-grid-community'
import React from 'react'

// Narrow row shape for the cell renderers.
type Row = {
  CompetitorName?: string
  IsCompetitorPriceAssociated?: boolean
  IsPlaceholder?: boolean
}

const dash = '—'

export const getPreviewColumnDefs = (): ColDef[] => [
  QuoteRow(),
  Competitor(),
  Publisher(),
  Terminal(),
  Product(),
  RankCategory(),
  Status(),
]

const QuoteRow = (): ColDef => ({
  field: 'GroupKey',
  headerName: 'Quote Row',
  rowGroup: true,
  hide: true,
})

const Competitor = (): ColDef => ({
  field: 'CompetitorName',
  headerName: 'Competitor',
  flex: 1,
  valueGetter: (p: { data?: Row }) =>
    p?.data?.IsPlaceholder ? 'No matching competitors' : (p?.data?.CompetitorName ?? ''),
  cellStyle: (p: { data?: Row }) =>
    p?.data?.IsPlaceholder ? { fontStyle: 'italic', color: 'var(--gray-600)' } : undefined,
})

const Publisher = (): ColDef => ({
  field: 'PublisherName',
  headerName: 'Publisher',
  flex: 1,
  valueGetter: (p: { data?: Row & { PublisherName?: string } }) =>
    p?.data?.IsPlaceholder ? dash : (p?.data?.PublisherName ?? ''),
})

const Terminal = (): ColDef => ({ field: 'TerminalName', headerName: 'Terminal' })

const Product = (): ColDef => ({ field: 'ProductName', headerName: 'Product' })

const RankCategory = (): ColDef => ({
  field: 'QuoteCompetitorCategoryName',
  headerName: 'Rank Category',
  valueGetter: (p: { data?: Row & { QuoteCompetitorCategoryName?: string | null } }) =>
    p?.data?.IsPlaceholder ? dash : (p?.data?.QuoteCompetitorCategoryName ?? ''),
})

const Status = (): ColDef => ({
  field: 'IsCompetitorPriceAssociated',
  headerName: 'Status',
  maxWidth: 160,
  // Filter shows label strings instead of the underlying boolean.
  valueGetter: (p: { data?: Row }) =>
    p?.data?.IsPlaceholder ? 'No matches' : p?.data?.IsCompetitorPriceAssociated ? 'Already exists' : 'New',
  cellRenderer: (params: { data?: Row }) => {
    if (params?.data?.IsPlaceholder) return <BBDTag>No matches</BBDTag>
    const exists = !!params?.data?.IsCompetitorPriceAssociated
    return exists ? <BBDTag>Already exists</BBDTag> : <BBDTag success>New</BBDTag>
  },
})
