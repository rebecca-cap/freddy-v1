import { Vertical } from '@gravitate-js/excalibrr'
import { PriceAdjustLabel } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/ConfigureIndexPrice/Components/PriceAdjustLabel'
import { Form, InputNumber } from 'antd'

export function FormulaDiff({ isAuction }: { isAuction: boolean }) {
  const title = <PriceAdjustLabel isAuction={isAuction} differentialLabel={'Formula Differential'} />
  const name = isAuction ? 'ReservePrice' : 'FormulaDifferential'
  return (
    <Vertical className={'my-4'}>
      <Form.Item
        name={name}
        label={title}
        rules={[
          { required: true, message: `${title} is required` },
          {
            validator: (_, value) => {
              if (value >= 8675309.0) {
                return Promise.reject(new Error(`${title} must not exceed $8,675,309`))
              }
              return Promise.resolve()
            },
          },
        ]}
        className={'mb-4'}
      >
        <InputNumber prefix={'$'} precision={fmt.currentPrecision} style={{ width: '100%' }} />
      </Form.Item>
    </Vertical>
  )
}
