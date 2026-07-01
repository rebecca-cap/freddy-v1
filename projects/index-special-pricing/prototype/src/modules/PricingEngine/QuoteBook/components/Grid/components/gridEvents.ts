import { isAnchorRow } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/QuoteSpreads/columnDefs'
import { PublicationModes, Quote, QuoteBookOverview } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import type { Dayjs } from '@utils/dayjs'
import dayjs from '@utils/dayjs'
import { GridApi } from 'ag-grid-community'
import React from 'react'

interface setAndShowAnalyticsProps {
  setSelectedAnalyticsRow: React.Dispatch<React.SetStateAction<Quote | null>>
  setTooManySelected: (tooManySelected: boolean) => void
  selectedRows: Quote[]
}
interface getAllRowsAndSetSelectedRowsToPublishProps {
  selectedRows: Quote[]
  setSelectedRowId: (rowId: number | null) => void
  setSelectedRowsToPublish: (rows: Quote[]) => void
  api: GridApi
  externalGridRef: React.MutableRefObject<GridApi<any> | null>
  showSpreadRows: boolean | null
  quotes?: QuoteBookOverview
}

interface GetLastSaveDateProps {
  quotes?: Quote[] | null
}

export function setAndShowAnalytics({
  setSelectedAnalyticsRow,
  setTooManySelected,
  selectedRows,
}: setAndShowAnalyticsProps) {
  if (selectedRows?.length > 1) {
    setTooManySelected(true)
  }
  setSelectedAnalyticsRow(() => selectedRows?.[0] as Quote)
}
function updateAssociatedSpreadRows(
  singleQuote: Quote,
  refs: any,
  publicationMode?: PublicationModes,
  quotes?: QuoteBookOverview
) {
  const children = quotes?.Data?.filter((r) => r.SpreadParentMappingId === singleQuote.QuoteConfigurationMappingId)

  if (children) {
    children?.forEach((child) => {
      child.StrategyBase.Value = Number(singleQuote.ProposedPrice)
      child.ProposedPrice = Number(singleQuote.ProposedPrice) + Number(child.Adjustment)
    })
  }

  // dont commit the transaction when spread rows are not showing due to console errors
  // we can use the toggle boolean to check whether to apply the transaction
  // or filter out children that are now shown in the grid, dont apply
  refs[`gridRef${publicationMode}`]?.current?.applyTransaction({ update: children })
}

export function manageDirtyQuotesListAndUpdateSpreadRows(
  singleQuote: Quote,
  dirtyQuotes: Quote[],
  setDirtyQuotes: React.Dispatch<React.SetStateAction<Quote[]>>,
  anchorIds: Set<number>,
  refs: any,
  publicationMode?: PublicationModes,
  quotes?: QuoteBookOverview
) {
  const dirtyQuote = {
    ...singleQuote,
  } as Quote

  const existingQuoteIndex = dirtyQuotes.findIndex(
    (q) => q.QuoteConfigurationMappingId === singleQuote.QuoteConfigurationMappingId
  )

  if (existingQuoteIndex === -1) {
    setDirtyQuotes((prev) => [...prev, dirtyQuote])
  } else {
    setDirtyQuotes((prev) => prev.map((q, index) => (index === existingQuoteIndex ? dirtyQuote : q)))
  }
  if (isAnchorRow(anchorIds, { data: singleQuote })) {
    updateAssociatedSpreadRows(singleQuote, refs, publicationMode, quotes)
  }
}

export function validateNewPricesAreGreaterThanZero(changes: Quote[]) {
  const adjustedPrices = changes.map((row) => {
    return Number(row.StrategyBase.Value) + (Number(row?.MarketMoveOverride) ?? 0) + Number(row.Adjustment ?? 0)
  })
  if (adjustedPrices.some((price) => price < 0)) {
    throw new Error('Price after applied changes cannot be negative')
  }
}

export function getAllRowsAndSetSelectedRowsToPublish({
  selectedRows,
  setSelectedRowId,
  setSelectedRowsToPublish,
  api,
  externalGridRef,
  showSpreadRows,
  quotes,
}: getAllRowsAndSetSelectedRowsToPublishProps) {
  const userSelectedRowIds = selectedRows.map((row) => row.QuoteConfigurationMappingId)
  const userSelectedParentIds = selectedRows
    .filter((row) => !row.SpreadParentMappingId && row.QuoteConfigurationMappingId)
    .map((row) => row.QuoteConfigurationMappingId)

  const rowsToPublish = [] as Quote[]
  const newRowIds: number[] = []

  externalGridRef?.current?.forEachNodeAfterFilterAndSort((node, index) => {
    // is it a quote row? we need to check because it can be a grouped header row (non data row)
    const gridRow = node?.data
    const isValidRow = !!gridRow
    const rowIdSelected = userSelectedRowIds.includes(gridRow?.QuoteConfigurationMappingId)

    // first check if it's a valid row (has data, i.e not a group header row)
    if (isValidRow) {
      const isParentRow = !gridRow.SpreadParentMappingId && gridRow.QuoteConfigurationMappingId

      // if it's the parent row node, and it's selected by the user, push it in as a row to publish
      if (isParentRow && rowIdSelected) {
        const parentRowNode = api.getRowNode(gridRow.QuoteConfigurationMappingId.toString())

        parentRowNode?.setSelected(true)

        rowsToPublish.push(gridRow)
        newRowIds.push(gridRow.QuoteConfigurationMappingId)

        // if the user is not showing spread rows, then we find all the spread rows and put it underneath each parent row
        if (!showSpreadRows) {
          const spreadRows = quotes?.Data?.filter(
            (r) => r.SpreadParentMappingId?.toString() === gridRow.QuoteConfigurationMappingId?.toString()
          )
          spreadRows?.forEach((spreadRow) => {
            const spreadRowNode = api.getRowNode(spreadRow.QuoteConfigurationMappingId.toString())
            spreadRowNode?.setSelected(true)

            rowsToPublish.push(spreadRow)
            newRowIds.push(spreadRow.QuoteConfigurationMappingId)
          })
        }
      }

      // if we're here, it's not a parent row and the user is showing spread rows. Check if this row is selected then push it in.
      if (showSpreadRows && !isParentRow) {
        const spreadRowNode = api.getRowNode(gridRow.QuoteConfigurationMappingId.toString())

        // if the user selected this spread rows parent id then select it
        if (userSelectedParentIds.includes(gridRow.SpreadParentMappingId)) {
          spreadRowNode?.setSelected(true)
          rowsToPublish.push(gridRow)
          newRowIds.push(gridRow.QuoteConfigurationMappingId)
        } else {
          spreadRowNode?.setSelected(false)
        }
      }
    }
  })

  setSelectedRowId(userSelectedParentIds[0] || null)
  setSelectedRowsToPublish(rowsToPublish)
}

/**
 * Given a spread child row, returns the IDs of the parent row and all its immediate children.
 * This defines the "spread family" that needs refreshing after a spread override save.
 */
export function getSpreadFamilyIds(row: Quote, allRows: Quote[]): number[] {
  const parentId = row.SpreadParentMappingId ?? row.QuoteConfigurationMappingId
  const childIds = allRows.filter((r) => r.SpreadParentMappingId === parentId).map((r) => r.QuoteConfigurationMappingId)
  return [parentId, ...childIds]
}

export function getLastSaveDate({ quotes }: GetLastSaveDateProps) {
  if (!quotes?.length) return null

  const initialDate: Dayjs | null = null

  const maxDate: Dayjs | null | undefined = quotes?.reduce<Dayjs | null>((date, row) => {
    if (!row.AdjustedDate) return date

    const currentDate = dayjs(row.AdjustedDate)

    if (!date) return currentDate

    return currentDate.isAfter(date, 'second') ? currentDate : date
  }, initialDate)

  return maxDate ? maxDate?.format('M/D, h:mmA') : 'None for period'
}
