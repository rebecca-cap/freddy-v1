import './styles.css'

import { FormulaBreakdownAndValuationDrawer } from '@components/shared/Drawers/FormulaBreakdownAndValuationDrawer'
import { useUser } from '@contexts/UserContext'
import { useLocalStorage, Vertical } from '@gravitate-js/excalibrr'
import { PublicationModes, Quote } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { useQuoteBook } from '@modules/PricingEngine/QuoteBook/api/useQuoteBook'
import { MarketMoveBreakdownAndValuationDrawer } from '@modules/PricingEngine/QuoteBook/components/Drawers/MarketMoveDrawer'
import { QuoteBookGrid } from '@modules/PricingEngine/QuoteBook/components/Grid'
import { QuoteBookHeader } from '@modules/PricingEngine/QuoteBook/components/Header'
import { QuoteBookPublishFooter } from '@modules/PricingEngine/QuoteBook/components/QuoteBookPublishFooter'
import { LastEOD, PublicationModeOptions } from '@modules/PricingEngine/QuoteBook/type.schema'
import { useQueryClient } from '@tanstack/react-query'
import { GridApi } from 'ag-grid-community'
import { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { QuoteBookPublishConfirmDrawer } from 'src/modules/PricingEngine/QuoteBook/components/Drawers/QuoteBookPublishConfirmDrawer'

import { QuoteBookHistoryDrawer } from './components/Drawers/HistoryDrawer'

export function QuoteBookPage() {
  const location = useLocation()
  const refs = {
    gridRefEndOfDay: useRef() as MutableRefObject<GridApi>,
    gridRefEndOfDayCurrentPeriod: useRef() as MutableRefObject<GridApi>,
    gridRefIntraDay: useRef() as MutableRefObject<GridApi>,
  }

  const [showAnalytics, setShowAnalytics] = useState<boolean>(false)
  const [selectedAnalyticsRow, setSelectedAnalyticsRow] = useState<Quote | null>(null)

  const [selectedValuationRow, setSelectedValuationRow] = useState<Quote | null>(null)
  const [selectedValuationId, setSelectedValuationId] = useState<number | null>(null)
  const [quoteHistoryHeaderInfo, setQuoteHistoryHeaderInfo] = useState<Quote>()
  const [selectedRowId, setSelectedRowId] = useState<number | null>(null)
  const [selectedRowsToPublish, setSelectedRowsToPublish] = useState<Quote[]>([])
  const [tooManySelected, setTooManySelected] = useState(false)

  const [isFormulaBreakdownAndValuationDrawerOpen, setIsFormulaBreakdownAndValuationDrawerOpen] =
    useState<boolean>(false)
  const [isMarketMoveBreakdownAndValuationDrawerOpen, setIsMarketMoveBreakdownAndValuationDrawerOpen] =
    useState<boolean>(false)
  const [isConfirmDrawerOpen, setIsConfirmDrawerOpen] = useState<boolean>(false)
  const [isQuoteHistoryDrawerOpen, setIsQuoteHistoryDrawerOpen] = useState<boolean>(false)

  const [isBulkChangeVisible, setIsBulkChangeVisible] = useState<boolean>(false)
  const [dirtyQuotes, setDirtyQuotes] = useState<Quote[]>([])

  const [publishMode, setPublishMode] = useState(false)
  const getRefKey = (mode: PublicationModes) => refs[`gridRef${mode}`]

  const { value: lastEOD, setValue: setLastEOD } = useLocalStorage<LastEOD>('eod_mode', PublicationModeOptions.EndOfDay)
  const [publicationMode, setPublicationMode] = useState<PublicationModes>()

  const { value: selectedGroupTabs, setValue: setSelectedGroupTabs } = useLocalStorage<string[]>(
    'QuoteBook::selectedGroupTabs',
    []
  )
  const { value: showSpreadRows, setValue: setShowSpreadRows } = useLocalStorage<boolean>(
    'QuoteBook::ShowSpreadRows',
    false
  )
  const { userPermissions } = useUser()
  const canWrite = !!userPermissions?.Quotebook?.Write

  const queryClient = useQueryClient()

  const { useQuoteBookMetaData, useQuoteBookUpdateAdjustmentsMutation } = useQuoteBook()
  const { data: metadata } = useQuoteBookMetaData(publicationMode)
  const updateAdjustments = useQuoteBookUpdateAdjustmentsMutation()

  const groupKeys = useMemo(
    () => metadata?.QuoteMappingGroups?.map((g) => String(g.QuoteConfigurationMappingGroupId)),
    [metadata?.QuoteMappingGroups]
  )

  useEffect(() => {
    //  use url to determine the publication mode
    if (location?.pathname?.toLowerCase()?.includes('midday')) {
      setPublicationMode(PublicationModeOptions.IntraDay)
    } else {
      setPublicationMode(lastEOD || PublicationModeOptions.EndOfDay)
    }
    setPublishMode(false)
  }, [location?.pathname])

  // default the first group if none have been selected
  useEffect(() => {
    if (groupKeys && groupKeys?.length > 0 && (!selectedGroupTabs || selectedGroupTabs.length === 0)) {
      setSelectedGroupTabs([groupKeys[0]])
    }
  }, [selectedGroupTabs, groupKeys])

  useEffect(() => {
    refs[`gridRef${publicationMode}`]?.current?.deselectAll()
  }, [publishMode])

  const handleGridReset = () => {
    if (!dirtyQuotes.length || !refs[`gridRef${publicationMode}`]?.current) return
    queryClient.invalidateQueries(['QuoteBook/GetRows'])
    setDirtyQuotes([])
    setSelectedRowsToPublish([])
    setPublishMode(false)
    refs[`gridRef${publicationMode}`].current?.deselectAll()
  }

  const handleAdjustmentUpdate = () => {
    const adjustments = dirtyQuotes
      .filter((dq) => !dq.SpreadParentMappingId)
      .map((quote) => {
        return {
          QuoteConfigurationMappingId: quote.QuoteConfigurationMappingId,
          Adjustment: typeof quote.Adjustment === 'string' ? parseFloat(quote.Adjustment) : quote.Adjustment || 0,
          MarketMoveOverride: quote.MarketMoveOverride ?? null,
        }
      })

    const payload = {
      PublicationMode: publicationMode,
      Updates: adjustments,
    }
    updateAdjustments.mutate(payload)
  }

  const gridTitle = useMemo(() => {
    switch (publicationMode) {
      case PublicationModeOptions.EndOfDay:
        return 'EOD'
      case PublicationModeOptions.EndOfDayCurrentPeriod:
        return 'Current Period'
      case PublicationModeOptions.IntraDay:
        return 'Midday'
      default:
        return ''
    }
  }, [publicationMode])
  const isUsingMarketMove = useMemo(() => !!metadata?.ShowMarketMoveColumns, [metadata])
  function clearStateOnGridChange() {
    setSelectedAnalyticsRow(null)
    setSelectedValuationRow(null)
    setSelectedValuationId(null)
    setQuoteHistoryHeaderInfo(undefined)
    setSelectedRowId(null)
    setSelectedRowsToPublish([])
    setTooManySelected(false)
    setIsFormulaBreakdownAndValuationDrawerOpen(false)
    setIsMarketMoveBreakdownAndValuationDrawerOpen(false)
    setIsConfirmDrawerOpen(false)
    setIsQuoteHistoryDrawerOpen(false)
    setIsBulkChangeVisible(false)
    setDirtyQuotes([])
    setPublishMode(false)
  }
  useEffect(() => {
    clearStateOnGridChange()
  }, [publicationMode])

  return (
    <Vertical className='flex-1 vertical-flex'>
      <QuoteBookHeader
        metadata={metadata}
        selectedGroupTabs={selectedGroupTabs}
        showAnalytics={showAnalytics}
        tooManySelected={tooManySelected}
        selectedAnalyticsRow={selectedAnalyticsRow}
        setSelectedGroupTabs={setSelectedGroupTabs}
      />
      <QuoteBookGrid
        isQuoteHistoryDrawerOpen={isQuoteHistoryDrawerOpen}
        publicationMode={publicationMode}
        canWrite={canWrite}
        dirtyQuotes={dirtyQuotes}
        metadata={metadata}
        setSelectedRowId={setSelectedRowId}
        setIsFormulaBreakdownAndValuationDrawerOpen={setIsFormulaBreakdownAndValuationDrawerOpen}
        setIsQuoteHistoryDrawerOpen={setIsQuoteHistoryDrawerOpen}
        setSelectedValuationId={setSelectedValuationId}
        setQuoteHistoryHeaderInfo={setQuoteHistoryHeaderInfo}
        isBulkChangeVisible={isBulkChangeVisible}
        setIsBulkChangeVisible={setIsBulkChangeVisible}
        publishMode={publishMode}
        getRefKey={getRefKey}
        showAnalytics={showAnalytics}
        selectedGroupTabs={selectedGroupTabs}
        showSpreadRows={showSpreadRows}
        setSelectedRowsToPublish={setSelectedRowsToPublish}
        setSelectedAnalyticsRow={setSelectedAnalyticsRow}
        setTooManySelected={setTooManySelected}
        setShowAnalytics={setShowAnalytics}
        setShowSpreadRows={setShowSpreadRows}
        setPublicationMode={setPublicationMode}
        setLastEOD={setLastEOD}
        gridTitle={gridTitle}
        refs={refs}
        setDirtyQuotes={setDirtyQuotes}
        setSelectedValuationRow={setSelectedValuationRow}
        setIsMarketMoveBreakdownAndValuationDrawerOpen={setIsMarketMoveBreakdownAndValuationDrawerOpen}
        isUsingMarketMove={isUsingMarketMove}
        selectedAnalyticsRow={selectedAnalyticsRow}
        handleAdjustmentUpdate={handleAdjustmentUpdate}
      />
      <div className='py-4 px-3 bg-2 bordered' style={{ display: 'flex', alignItems: 'center' }}>
        <QuoteBookPublishFooter
          publicationMode={publicationMode}
          canWrite={canWrite}
          setPublishMode={setPublishMode}
          publishMode={publishMode}
          handleGridReset={handleGridReset}
          dirtyQuotes={dirtyQuotes}
          refs={refs}
          setIsBulkChangeVisible={setIsBulkChangeVisible}
          setIsConfirmDrawerOpen={setIsConfirmDrawerOpen}
          setShowAnalytics={setShowAnalytics}
          selectedRowsToPublish={selectedRowsToPublish}
          handleAdjustmentUpdate={handleAdjustmentUpdate}
        />
      </div>
      <FormulaBreakdownAndValuationDrawer
        selectedValuationId={selectedValuationId}
        isFormulaBreakdownAndValuationDrawerOpen={isFormulaBreakdownAndValuationDrawerOpen}
        setIsFormulaBreakdownAndValuationDrawerOpen={setIsFormulaBreakdownAndValuationDrawerOpen}
        setSelectedValuationId={setSelectedValuationId}
      />
      <MarketMoveBreakdownAndValuationDrawer
        selectedValuationRow={selectedValuationRow}
        isMarketMoveBreakdownAndValuationDrawerOpen={isMarketMoveBreakdownAndValuationDrawerOpen}
        setIsMarketMoveBreakdownAndValuationDrawerOpen={setIsMarketMoveBreakdownAndValuationDrawerOpen}
        setSelectedValuationRow={setSelectedValuationRow}
        publicationMode={publicationMode}
      />
      <QuoteBookPublishConfirmDrawer
        gridTitle={gridTitle}
        isConfirmDrawerOpen={isConfirmDrawerOpen}
        setIsConfirmDrawerOpen={setIsConfirmDrawerOpen}
        selectedRowsToPublish={selectedRowsToPublish}
        handleGridReset={handleGridReset}
        setPublishMode={setPublishMode}
        publicationMode={publicationMode}
        isUsingMarketMove={isUsingMarketMove}
      />
      <QuoteBookHistoryDrawer
        isQuoteHistoryDrawerOpen={isQuoteHistoryDrawerOpen}
        setIsQuoteHistoryDrawerOpen={setIsQuoteHistoryDrawerOpen}
        selectedRowId={selectedRowId}
        quoteHistoryHeaderInfo={quoteHistoryHeaderInfo}
      />
    </Vertical>
  )
}
