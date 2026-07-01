import './components/sideBysideStyles.css'

import { useLocalStorage } from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/Api/types.schema'
import { AllocationGrid } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/AllocationGrid'
import { QuoteCompetitorView } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/CompetitorPricesView'
import { GridApi } from 'ag-grid-community'
import React, { useEffect, useRef } from 'react'

interface SideBySideViewProps {
  selectedRow: Quote | null
  quoteRowId: number
  isTransposed: boolean
  useOpisPrices: boolean | undefined
}
export function SideBySideView({ selectedRow, quoteRowId, isTransposed, useOpisPrices }: SideBySideViewProps) {
  const gridAPIRef = useRef() as React.MutableRefObject<GridApi>
  const transposedGridAPIRef = useRef() as React.MutableRefObject<GridApi>
  const transposedStorageKey = 'QuoteBookAnalytics-AllocationTransposed'
  const storageKey = 'QuoteBookAnalytics-Allocation'
  const containerRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const resizeRef = useRef() as React.MutableRefObject<HTMLDivElement>
  const { value: competitorGridWidth, setValue: setCompetitorGridWidth } = useLocalStorage(
    'QuoteBookAnalytics-SideBySideView-CompetitorGridWidth',
    '50%'
  )
  const [widthAsPercent, setWidthAsPercent] = React.useState<string | null>(competitorGridWidth || null)
  const [containerWidth, setContainerWidth] = React.useState<number | null>(null)
  const [resizeWidth, setResizeWidth] = React.useState<number | null>(null)
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setContainerWidth(entries[0].contentRect.width)
    })
    observer.observe(containerRef.current)
    return () => resizeRef.current && observer.unobserve(containerRef.current)
  }, [])
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      setResizeWidth(entries[0].contentRect.width)
    })
    observer.observe(resizeRef.current)
    return () => resizeRef.current && observer.unobserve(resizeRef.current)
  }, [])

  useEffect(() => {
    if (resizeWidth && containerWidth) {
      const percent = ((resizeWidth / containerWidth) * 100).toFixed(2)
      if (percent && percent !== 'NaN') {
        setCompetitorGridWidth(`${percent}%`)
        setWidthAsPercent(percent)
      }
    }
  }, [resizeWidth])
  return (
    <div className='horizontal-flex' ref={containerRef}>
      <div
        ref={resizeRef}
        style={{
          resize: 'horizontal',
          overflow: 'auto',
          minWidth: '5%',
          maxWidth: '95%',
          width: widthAsPercent || '50%',
        }}
      >
        <QuoteCompetitorView
          quoteRowId={quoteRowId}
          selectedRow={selectedRow}
          gridOnlyView
          key='CompetitorView'
          useOpisPrices={useOpisPrices}
        />
      </div>
      {isTransposed ? (
        <AllocationGrid
          quoteRowId={quoteRowId}
          key='AllocationView-transposed'
          isTransposed={isTransposed}
          gridAPIRef={transposedGridAPIRef}
          storageKey={transposedStorageKey}
        />
      ) : (
        <AllocationGrid
          quoteRowId={quoteRowId}
          key='AllocationView'
          isTransposed={isTransposed}
          gridAPIRef={gridAPIRef}
          storageKey={storageKey}
        />
      )}
    </div>
  )
}
