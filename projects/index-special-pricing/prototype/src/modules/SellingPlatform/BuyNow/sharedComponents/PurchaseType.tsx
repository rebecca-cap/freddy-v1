import { BarChartOutlined, LineChartOutlined } from '@ant-design/icons'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Segmented } from 'antd'
import styles from './PurchaseType.module.css'

interface PurchaseTypeProps {
  isBid: boolean
}

export function PurchaseType({ isBid }: PurchaseTypeProps) {
  const selectedValue = isBid ? 'bid' : 'market'

  return (
    <Horizontal className='justify-sb' verticalCenter width={325}>
      <Texto category='h5' appearance={'medium'} weight={900} className='mr-2'>
        PURCHASE TYPE
      </Texto>
      <Segmented
        className={styles.purchaseTypeSegmented}
        value={selectedValue}
        size='large'
        options={[
          {
            label: (
              <>
                <BarChartOutlined /> Market
              </>
            ),
            value: 'market',
          },
          {
            label: (
              <>
                <LineChartOutlined /> Bid
              </>
            ),
            value: 'bid',
          },
        ]}
      />
    </Horizontal>
  )
}
