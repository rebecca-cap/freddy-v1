import { BarChartOutlined, DownloadOutlined } from '@ant-design/icons'
import { addCommasToNumber, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { selectedQuoteRowDistinctColor } from '@modules/PricingEngine/QuoteBook/Components/AnalyticsView/CompetitorPricesView/components/util'
import { Tooltip } from 'antd'
import React, { useMemo } from 'react'

interface PriceBoxProps {
  label: string
  price: number
  name?: string
}

export function PriceBox({ label, price, name }: PriceBoxProps) {
  const icon = useMemo(() => {
    if (label === 'MAX') {
      return <DownloadOutlined rotate={180} style={{ color: 'var(--theme-success)', fontSize: '1.3em' }} />
    }
    if (label === 'MIN') {
      return <DownloadOutlined style={{ color: 'var(--theme-success)', fontSize: '1.3em' }} />
    }

    if (label === 'AVG') {
      return <BarChartOutlined style={{ color: 'var(--theme-success)', fontSize: '1.3em' }} />
    }
    return null
  }, [label])
  const isSelectedQuoteRow = useMemo(() => ['MAX', 'MIN', 'AVG'].every((item) => label !== item), [label])
  const textColor = useMemo(() => (isSelectedQuoteRow ? 'white' : 'default'), [isSelectedQuoteRow])
  return (
    <Vertical
      verticalCenter
      className='bordered px-3 py-1'
      style={{
        backgroundColor: isSelectedQuoteRow ? selectedQuoteRowDistinctColor : '',
        borderRadius: '3px',
        maxHeight: 50,
      }}
    >
      <Horizontal justifyContent='space-between' verticalCenter>
        <Horizontal verticalCenter>
          <Texto className='mr-1' category='h6' appearance={textColor}>
            {label}
          </Texto>
          <Texto category='h6' weight='normal' appearance={textColor}>
            Price
          </Texto>
        </Horizontal>
        <Horizontal verticalCenter>
          {icon}
          <Texto className='ml-1' category='h6' appearance={textColor}>
            {addCommasToNumber(price, 4)}
          </Texto>
        </Horizontal>
      </Horizontal>
      {!!name && (
        <Horizontal justifyContent='left' flex={1}>
          <Texto
            category='label'
            align='left'
            appearance={textColor}
            style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          >
            <Tooltip title={name} placement='left'>
              {name}
            </Tooltip>
          </Texto>
        </Horizontal>
      )}
    </Vertical>
  )
}
