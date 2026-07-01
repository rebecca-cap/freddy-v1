import '../styles.css'

import { getComputedStyleValue } from '@components/TheArmory/helpers'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useLocalStorage } from '@gravitate-js/excalibrr'
import dayjs from '@utils/dayjs'
import React from 'react'

import { ForwardProcessedVolume } from './ForwardProcessedVolume'
import { ProcessedVolume } from './ProcessedVolume'
import { PromptProcessedVolume } from './PromptProcessedVolume'
import { TotalProfits } from './TotalProfits'

export function AdminCharts() {
  const defaultFilterValues = {
    ProcessedVolume: {
      option: 'LastWeek',
      label: 'Last 7 Days',
      FromDate: dayjs().subtract(7, 'days').startOf('day'),
      ToDate: dayjs().endOf('day'),
    },
    TotalProfits: {
      option: 'LastWeek',
      label: 'Last 7 Days',
      FromDate: dayjs().subtract(7, 'days').startOf('day'),
      ToDate: dayjs().endOf('day'),
    },
    ProcessedPromptVolume: {
      option: 'LastWeek',
      label: 'Last 7 Days',
      FromDate: dayjs().subtract(7, 'days').startOf('day'),
      ToDate: dayjs().endOf('day'),
    },
    ProcessedForwardVolume: {
      option: 'LastWeek',
      label: 'Last 7 Days',
      FromDate: dayjs().subtract(7, 'days').startOf('day'),
      ToDate: dayjs().endOf('day'),
    },
  }
  const { value: chartFilters, setValue: setChartFilters } = useLocalStorage('adminChartFilters', defaultFilterValues)

  const getDates = (selectedValue) => {
    let fromDate
    let toDate

    switch (selectedValue) {
      case 'Today':
        fromDate = dayjs().startOf('day')
        toDate = dayjs().endOf('day')
        break
      case 'LastWeek':
        fromDate = dayjs().subtract(7, 'days').startOf('day')
        toDate = dayjs().endOf('day')
        break
      case 'LastMonth':
        fromDate = dayjs().subtract(1, 'month').startOf('month')
        toDate = dayjs().subtract(1, 'month').endOf('month')
        break
      case 'MTD':
        fromDate = dayjs().subtract(1, 'month').startOf('day')
        toDate = dayjs().endOf('day')
        break
      case 'YTD':
        fromDate = dayjs().subtract(1, 'year').startOf('day')
        toDate = dayjs().endOf('day')
        break
      default:
        fromDate = null
        toDate = null
        break
    }

    fromDate = dayjs(fromDate).toDate()
    toDate = dayjs(toDate).toDate()

    return { fromDate, toDate }
  }

  const selectOptions = [
    { value: 'Today', label: 'Today' },
    { value: 'LastWeek', label: 'Last 7 Days' },
    { value: 'LastMonth', label: 'Prior Month' },
    { value: 'MTD', label: 'MTD' },
    { value: 'YTD', label: 'YTD' },
  ] as const

  const onFiltersChange = (key, selectedValue) => {
    const dates = getDates(selectedValue)
    const selectedOption = selectOptions.find((item) => item.value === selectedValue)
    setChartFilters((prev) => {
      const filter = {
        ...prev[key],
        option: selectedValue,
        FromDate: dates.fromDate,
        ToDate: dates.toDate,
        label: selectedOption.label,
      }
      return { ...prev, [key]: { ...filter } }
    })
  }

  const currencyTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload
      return (
        <div className='bg-1 bordered px-1' style={{ verticalAlign: 'center' }}>
          <Texto category='label'>{fmt.currency(dataPoint.uv, 0)}</Texto>
        </div>
      )
    }
    return null
  }

  const volumeTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload
      return (
        <div className='bg-1 bordered px-1' style={{ verticalAlign: 'center' }}>
          <Texto category='label'>{fmt.decimal(dataPoint.uv, 0)}</Texto>
        </div>
      )
    }
    return null
  }

  const strokeColor = getComputedStyleValue(document.documentElement, true ? '--theme-color-2' : '--theme-error').trim()
  const fillColor = getComputedStyleValue(
    document.documentElement,
    true ? '--theme-color-2-trans' : '--theme-error-dim'
  ).trim()

  return (
    <Horizontal height='100%'>
      <Vertical flex={10} gap={20}>
        <ProcessedVolume
          tooltipContent={volumeTooltipContent}
          strokeColor={strokeColor}
          fillColor={fillColor}
          chartFilters={chartFilters}
          onFiltersChange={onFiltersChange}
          selectOptions={selectOptions}
        />
        <TotalProfits
          tooltipContent={currencyTooltipContent}
          strokeColor={strokeColor}
          fillColor={fillColor}
          chartFilters={chartFilters}
          onFiltersChange={onFiltersChange}
          selectOptions={selectOptions}
        />
        <PromptProcessedVolume
          strokeColor={strokeColor}
          chartFilters={chartFilters}
          onFiltersChange={onFiltersChange}
          selectOptions={selectOptions}
        />
        <ForwardProcessedVolume
          strokeColor={strokeColor}
          chartFilters={chartFilters}
          onFiltersChange={onFiltersChange}
          selectOptions={selectOptions}
        />
      </Vertical>
    </Horizontal>
  )
}
