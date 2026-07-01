import '../../styles.css'

import { RetweetOutlined } from '@ant-design/icons'
import { AnalyticsType } from '@api/useQuoteBookAnalytics/response'
import { Horizontal, RangePicker, Texto, useLocalStorage, Vertical } from '@gravitate-js/excalibrr'
import { Quote } from '@modules/PricingEngine/QuoteBook/api/types.schema'
import { useQuoteBook } from '@modules/PricingEngine/QuoteBook/api/useQuoteBook'
import { SideBySideView } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/SideBySideView'
import { isDefinedAndNotNull } from '@utils/index'
import { Radio, Select, Switch } from 'antd'
import moment from 'moment'
import React, { useMemo } from 'react'

import { analyticTypes } from './common/analyticsTypesSelect'
import { MessageAskingUserToSelectAQuoteRow } from './common/messageAskingUserToSelectAQuoteRow'
import { QuoteCompetitorView } from './CompetitorPricesView'
import { CustomerLiftingsView } from './CustomerLiftingsView'
import { LiftingVsBenchmarkView } from './LiftingsVsBenchmarkView'
import { LiftingVsMarginView } from './LiftingsVsMarginView'

interface QuoteAnalyticsViewProps {
  selectedRow: Quote | null
  tooManySelected: boolean
}

const defaultQuoteAnalytic = 'LiftingVsBenchmark' as AnalyticsType
const defaultDateFilter = [moment().subtract(30, 'day').startOf('day'), moment().endOf('day')]
const defaultPeriodFilter = '30D'

export function QuoteAnalyticsView({ selectedRow, tooManySelected = false }: QuoteAnalyticsViewProps) {
  const selectedQuoteRowId = selectedRow?.QuoteConfigurationMappingId
  const { value: selectedQuoteAnalytic, setValue: setSelectedQuoteAnalytic } = useLocalStorage(
    'QuoteAnalyticView',
    defaultQuoteAnalytic
  )
  const { value: analyticDateFilter, setValue: setAnalyticDateFilter } = useLocalStorage(
    'QuoteAnalyticDateFilter',
    defaultDateFilter
  )

  const { value: analyticPeriodFilter, setValue: setAnalyticPeriodFilter } = useLocalStorage(
    'QuoteAnalyticPeriodFilter',
    defaultPeriodFilter
  )
  const { value: isTransposed, setValue: setIsTransposed } = useLocalStorage('isTransposed', false)
  const { value: useOpisPrices, setValue: setUseOpisPrices } = useLocalStorage('useOpisPrices', false)

  const { getReferenceStrategyData } = useQuoteBook()
  const { data: FormulaNameData } = getReferenceStrategyData(selectedQuoteRowId)
  const selectedView = analyticTypes.find((type) => type.value === selectedQuoteAnalytic)?.value
  const showRangePicker = useMemo(
    () => selectedView !== 'Competitor' && selectedView !== 'Allocation' && selectedView !== 'Customer',
    [selectedView]
  )

  const OpisPricesOptions = [
    { label: 'Intraday', value: 'intraday' },
    { label: 'End of Day', value: 'endOfDay' },
  ]

  function updateDateRange(range: string) {
    const today = moment().endOf('day')

    let start
    switch (range) {
      case '7D':
        start = moment().subtract(7, 'day').startOf('day')
        break
      case '30D':
        start = moment().subtract(30, 'day').startOf('day')
        break
      case '90D':
        start = moment().subtract(90, 'day').startOf('day')
        break
    }

    setAnalyticDateFilter([start, today])
  }

  function renderContent() {
    if (!selectedQuoteRowId) {
      return <MessageAskingUserToSelectAQuoteRow tooManySelected={tooManySelected} />
    }

    switch (selectedView) {
      case 'LiftingVsBenchmark':
        return (
          <LiftingVsBenchmarkView
            quoteRowId={selectedQuoteRowId}
            fromDate={analyticDateFilter[0]}
            toDate={analyticDateFilter[1]}
            selectedRow={selectedRow}
          />
        )
      case 'LiftingVsMargin':
        return (
          <LiftingVsMarginView
            quoteRowId={selectedQuoteRowId}
            fromDate={analyticDateFilter[0]}
            toDate={analyticDateFilter[1]}
          />
        )
      case 'Customer':
        return (
          <CustomerLiftingsView
            quoteRowId={selectedQuoteRowId}
            fromDate={analyticDateFilter[0]}
            toDate={analyticDateFilter[1]}
          />
        )
      case 'Competitor':
        return (
          <QuoteCompetitorView
            quoteRowId={selectedQuoteRowId}
            selectedRow={selectedRow}
            useOpisPrices={!!useOpisPrices}
          />
        )
      case 'Allocation':
        return (
          <SideBySideView
            quoteRowId={selectedQuoteRowId}
            selectedRow={selectedRow}
            isTransposed={!!isTransposed}
            useOpisPrices={!!useOpisPrices}
          />
        )
      default:
        return 'Oops??! Should not get here, unknown analytic type'
    }
  }
  if (!isDefinedAndNotNull(selectedQuoteRowId))
    return <MessageAskingUserToSelectAQuoteRow tooManySelected={tooManySelected} />
  return (
    <Vertical className='bg-1 bordered'>
      <Horizontal className='px-4 py-2 justify-sb bordered' verticalCenter>
        <Horizontal flex={1} className='justify-sb'>
          <Horizontal verticalCenter>
            <Texto category='h5'>Quote Analytics</Texto>
            <Select
              className='ml-4'
              options={analyticTypes}
              value={selectedQuoteAnalytic}
              onChange={(value) => setSelectedQuoteAnalytic(value)}
            />
            {!!FormulaNameData?.FormulaName && (
              <Horizontal className='ml-4' verticalCenter>
                <Texto style={{ minWidth: 'fit-content' }} category='h5'>
                  Formula Name:
                </Texto>
                <Texto className='ml-1 text-truncate' category='h5'>
                  {FormulaNameData.FormulaName}
                </Texto>
              </Horizontal>
            )}
          </Horizontal>
          {(selectedView === 'Competitor' || selectedView === 'Allocation') && (
            <Horizontal className='mr-5' verticalCenter>
              <Radio.Group
                className='mr-5'
                options={OpisPricesOptions}
                onChange={({ target: { value } }) => setUseOpisPrices(value === 'intraday')}
                value={useOpisPrices ? 'intraday' : 'endOfDay'}
                optionType='button'
                buttonStyle='solid'
              />
            </Horizontal>
          )}
          {selectedView === 'Customer' && (
            <Horizontal className='mr-5' verticalCenter>
              <Texto className='mr-2'>Period:</Texto>
              <Select
                value={analyticPeriodFilter}
                style={{ width: 100 }}
                onChange={(value) => {
                  setAnalyticPeriodFilter(value)
                  updateDateRange(value)
                }}
              >
                <Select.Option value='7D'>7 Days</Select.Option>
                <Select.Option value='30D'>30 Days</Select.Option>
                <Select.Option value='90D'>90 Days</Select.Option>
              </Select>
            </Horizontal>
          )}
        </Horizontal>
        {showRangePicker && (
          <Horizontal flex={1} verticalCenter style={{ minWidth: 'fit-content' }} className='ml-2 justify-end'>
            <RangePicker
              inputKey='dates'
              dates={analyticDateFilter?.map((d) => moment(d)) || defaultDateFilter}
              onChange={(dates) => setAnalyticDateFilter(dates.map((d) => moment(d)))}
              placement='bottomRight'
            />
          </Horizontal>
        )}
        {selectedView === 'Allocation' && (
          <Horizontal flex={1} className='justify-end' verticalCenter>
            <Texto className='p-2'>Transpose Allocation Grid</Texto>
            <Switch
              size='small'
              checked={!!isTransposed}
              onChange={(value) => setIsTransposed(value)}
              unCheckedChildren={<RetweetOutlined />}
              className='mr-5 ml-2'
            />
          </Horizontal>
        )}
      </Horizontal>
      <Horizontal fullHeight>
        <Vertical className='bg-1' flex={6}>
          {renderContent()}
        </Vertical>
      </Horizontal>
    </Vertical>
  )
}
