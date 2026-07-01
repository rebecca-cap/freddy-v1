import { BarChartOutlined, LineChartOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Radio } from 'antd'

interface PurchaseTypeProps {
  isBid: boolean
}

export function PurchaseType({ isBid }: PurchaseTypeProps) {
  const selectedValue = isBid ? 'bid' : 'market'

  return (
    <Horizontal className='justify-sb' verticalCenter width={325}>
      <Texto category='h5' weight={900} className='mr-2'>
        PURCHASE TYPE
      </Texto>
      <Radio.Group value={selectedValue} disabled>
        <Radio.Button style={{ minWidth: 80, textAlign: 'center' }} value='market' key='market'>
          <BarChartOutlined /> Market
        </Radio.Button>
        <Radio.Button style={{ minWidth: 80, textAlign: 'center' }} value='bid' key='bid'>
          <LineChartOutlined /> Bid
        </Radio.Button>
      </Radio.Group>
    </Horizontal>
  )
}
