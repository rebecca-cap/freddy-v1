import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { type CompetitorPricingRecord } from '@modules/PricingEngine/QuoteBook/components/AnalyticsView/CompetitorPricesView/api/schema.types'
import { Radio } from 'antd'
import React, { useMemo } from 'react'

interface RadioButtonHeaderProps {
  data?: CompetitorPricingRecord[] | undefined
  selectedCompetitor: string
  setSelectedCompetitor: React.Dispatch<React.SetStateAction<string>>
}
export function RadioButtonHeader({ data, selectedCompetitor, setSelectedCompetitor }: RadioButtonHeaderProps) {
  const radioButtonOptions = useMemo(() => {
    const selectedRowPublisherName = data?.find((item) => item.IsSelectedRow)?.Category
    const publishers = Array.from(
      new Set(data?.map((item) => item.Category).filter((item) => item !== selectedRowPublisherName))
    )
    return ['All', ...publishers].map((item) => ({ label: item, value: item }))
  }, [data])
  return (
    <Horizontal className='p-2 border-bottom' verticalCenter>
      <Texto className='mr-5'>Competitor Prices:</Texto>
      <Radio.Group
        onChange={(e) => setSelectedCompetitor(e?.target?.value)}
        value={selectedCompetitor}
        options={radioButtonOptions}
      />
    </Horizontal>
  )
}
