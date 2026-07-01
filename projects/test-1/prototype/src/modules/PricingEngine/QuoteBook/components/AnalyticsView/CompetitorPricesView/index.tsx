import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { type CompetitorPricingRecord } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/api/schema.types'
import { useQuoteAnalyticsCompetitorPrices } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/api/useQuoteAnalyticsCompetitorPrices'
import { PricingChart } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/components/Chart'
import { PricingChartLegend } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/components/Chart/PricingChartLegend'
import { PricingGrid } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/components/Grid'
import { RadioButtonHeader } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/components/RadioButtonHeader'
import { selectedQuoteRowDistinctColor } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/components/util'
import { generateShades } from '@utils/index'
import { GridApi } from 'ag-grid-community'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import { Loading, NoData } from '../common/messageAskingUserToSelectAQuoteRow'
import { Summary } from './components/Summary'

interface CompetitorPricesViewProps {
  quoteRowId: number
  selectedRow: Quote | null
  useOpisPrices: boolean | undefined
  gridOnlyView?: boolean
}

export function QuoteCompetitorView({
  quoteRowId,
  selectedRow,
  gridOnlyView,
  useOpisPrices,
}: CompetitorPricesViewProps) {
  const { getCompetitorPricesQuery } = useQuoteAnalyticsCompetitorPrices()
  const { data: priceData, isLoading } = getCompetitorPricesQuery(quoteRowId, useOpisPrices)
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('All')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const shades = useMemo(
    () => generateShades('--theme-color-2').filter((item, index) => index % 2 === 0 && index !== 0),
    []
  )

  const categoriesWithWithShadesDict = useMemo(() => {
    if (!priceData?.length) return []
    const sortedData = [...priceData].sort((a, b) => b.Price - a.Price)
    const categories = Array.from(
      new Set(sortedData.map((item) => (!item.IsSelectedRow ? item.Category : 'Selected Row')) || [])
    )
    return categories.map((category, index) => ({
      category,
      shade: category === 'Selected Row' ? selectedQuoteRowDistinctColor : shades[index],
    }))
  }, [priceData, shades])

  function addShadesToData(dataCopy: CompetitorPricingRecord[]) {
    return dataCopy.map((item) => ({
      ...item,
      shade: item.IsSelectedRow
        ? selectedQuoteRowDistinctColor
        : categoriesWithWithShadesDict.find((pub) => pub.category === item.Category)?.shade,
    }))
  }

  const filteredShadedData = useMemo(() => {
    if (!priceData?.length || !categoriesWithWithShadesDict) return []
    const shadeData = addShadesToData([...priceData] as CompetitorPricingRecord[])
    if (selectedCompetitor === 'All') {
      return shadeData
    }
    return shadeData.filter((item) => item.Category === selectedCompetitor || item.IsSelectedRow)
  }, [priceData, selectedCompetitor, categoriesWithWithShadesDict])

  useEffect(() => {
    setSelectedCompetitor('All')
  }, [selectedRow])

  const gridAPIRef = useRef() as React.MutableRefObject<GridApi<any>>
  const gridOnlyAPIRef = useRef() as React.MutableRefObject<GridApi<any>>
  const storageKey = 'QuoteBookAnalytics-CompetitorPrices-fullView'
  const gridOnlyStorageKey = 'QuoteBookAnalytics-CompetitorPrices-gridOnlyView'

  if (gridOnlyView) {
    if (isLoading) {
      return (
        <Vertical scroll flex={1} style={{ height: '100%', minHeight: '250px' }}>
          <Loading />
        </Vertical>
      )
    }
    return (
      <Vertical scroll flex={1} style={{ height: '100%', minHeight: '250px' }}>
        {!priceData || !priceData?.length ? (
          <NoData />
        ) : (
          <PricingGrid
            pricingData={filteredShadedData}
            selectedItem={selectedItem}
            selectedRow={selectedRow}
            gridAPIRef={gridOnlyAPIRef}
            storageKey={gridOnlyStorageKey}
            useOpisPrices={useOpisPrices}
          />
        )}
      </Vertical>
    )
  }

  if (isLoading) {
    return <Loading />
  }
  if (!priceData || !priceData?.length || !filteredShadedData?.length) {
    return <NoData />
  }

  return (
    <Vertical className='full-height-width'>
      <RadioButtonHeader
        data={priceData}
        setSelectedCompetitor={setSelectedCompetitor}
        selectedCompetitor={selectedCompetitor}
      />
      <Horizontal className='full-height-width'>
        <Vertical verticalCenter className='p-4' style={{ minWidth: '300px', maxWidth: '400px', maxHeight: '300px' }}>
          <PricingChart pricingData={filteredShadedData} setSelectedItem={setSelectedItem} />
          <PricingChartLegend
            categoriesWithShadesDict={categoriesWithWithShadesDict}
            selectedCompetitor={selectedCompetitor}
          />
        </Vertical>
        <Vertical flex={1} className='m-4' style={{ gap: '0.5em', maxWidth: '250px' }}>
          <Summary pricingData={filteredShadedData} />
        </Vertical>
        <Vertical scroll flex={3} style={{ height: '100%' }}>
          <PricingGrid
            pricingData={filteredShadedData}
            selectedItem={selectedItem}
            selectedRow={selectedRow}
            gridAPIRef={gridAPIRef}
            storageKey={storageKey}
            useOpisPrices={useOpisPrices}
          />
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
