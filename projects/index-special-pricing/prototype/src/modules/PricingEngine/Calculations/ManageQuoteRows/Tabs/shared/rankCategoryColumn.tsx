import { stopCloseOnEnter, suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import type { SelectListItem } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/CompetitorMappings/Api/types.schema'
import { isDefined } from '@utils/index'
import type { ColDef } from 'ag-grid-community'

export type RankCategoryConfig = { IncludeInCategoryRank?: boolean; QuoteCompetitorCategoryId?: number }

export const getIncludedCategoryIds = (configs: RankCategoryConfig[] | null | undefined): number[] =>
  configs
    ?.filter((c) => c.IncludeInCategoryRank && isDefined(c.QuoteCompetitorCategoryId))
    .map((c) => c.QuoteCompetitorCategoryId as number) ?? []

// Multi-select Rank Category backed by the row's CompetitorCategoryConfigs.
// Selected categories rank with IncludeInCategoryRank=true; deselecting flips
// the flag off. None selected = participates across all categories.
// Shared between the Quote Rows and Competitor Mappings grids — both render
// the same column against the same row shape, differing only in where the
// category option list comes from.
export const RankCategory = (
  canWrite: boolean,
  categoryList: SelectListItem[] | undefined,
  onUpdateRankCategories: ((mappingId: number, categoryIds: number[]) => void) | undefined
): ColDef => ({
  field: 'CompetitorCategoryConfigs',
  headerName: 'Rank Category',
  editable: canWrite,
  cellEditor: 'SearchableSelect',
  cellEditorPopup: true,
  suppressKeyboardEvent,
  cellEditorParams: (params) => ({
    mode: 'multiple',
    showSearch: true,
    onKeyDown: stopCloseOnEnter,
    options: categoryList?.map((c) => ({ value: Number(c.Value), label: c.Text ?? '' })) ?? [],
    value: getIncludedCategoryIds(params?.data?.CompetitorCategoryConfigs),
  }),
  valueGetter: (params) =>
    getIncludedCategoryIds(params?.data?.CompetitorCategoryConfigs)
      .map((id) => categoryList?.find((c) => Number(c.Value) === id)?.Text)
      .filter(Boolean)
      .join(', '),
  valueSetter: (params) => {
    const selectedIds: number[] = (params.newValue ?? []).map(Number)
    const existing: RankCategoryConfig[] = params.data.CompetitorCategoryConfigs ?? []
    const existingIds = existing.map((c) => c.QuoteCompetitorCategoryId)
    // Flip flags on existing configs and append configs for newly selected categories
    params.data.CompetitorCategoryConfigs = [
      ...existing.map((c) => ({
        ...c,
        IncludeInCategoryRank: selectedIds.includes(c.QuoteCompetitorCategoryId as number),
      })),
      ...selectedIds
        .filter((id) => !existingIds.includes(id))
        .map((id) => ({ QuoteCompetitorCategoryId: id, IncludeInCategoryRank: true })),
    ]
    onUpdateRankCategories?.(params.data.QuoteConfigurationMappingId, selectedIds)
    return true
  },
})
