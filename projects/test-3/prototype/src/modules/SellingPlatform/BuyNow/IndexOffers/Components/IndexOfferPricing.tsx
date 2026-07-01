import { useIndexOffersContext } from '@contexts/IndexOffersContext'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { formatDifferentialAsCurrency } from '@utils/index'
import { Form, InputNumber, List } from 'antd'

export function IndexOfferPricing() {
  const { entryData } = useIndexOffersContext()
  const selectedOffer = entryData?.SelectedIndexOffer

  const contractDifferential = selectedOffer?.ContractDifferential
  const formulaDisplayName = selectedOffer?.FormulaDisplayName
  const formulaVariables = (selectedOffer?.FormulaVariables ?? []).filter(
    (v) => v.VariableName !== 'ContractDifferential'
  )
  const isBid = entryData?.IsBid ?? false

  return (
    <Vertical flex={3}>
      <Texto category='h6' weight={900} className='mr-2'>
        PRICING
      </Texto>
      <Horizontal className={'mt-4'}>
        <Vertical>
          <Texto>Price Formula</Texto>
          <Texto className={'mt-2'} weight={'bold'}>
            {formulaDisplayName ?? '-'}
          </Texto>
        </Vertical>
      </Horizontal>
      <Horizontal className={'index-offer-pricing-formula-differential'}>
        <Vertical justifyContent={'space-between'}>
          <Texto className={'mb-4'} category={'h6'}>
            Contract Differential
          </Texto>
          {isBid ? (
            <Form.Item name='BidPrice' className='mb-0'>
              <InputNumber
                placeholder={`${contractDifferential?.toFixed(4)}`}
                precision={4}
                step={0.0001}
                style={{ width: '100%', fontSize: '24px', fontWeight: 'bold' }}
              />
            </Form.Item>
          ) : (
            <Texto category={'h3'} style={{ whiteSpace: 'nowrap' }}>
              {formatDifferentialAsCurrency(contractDifferential)}
            </Texto>
          )}
        </Vertical>
      </Horizontal>
      {/*<Texto className={'mt-5'} weight={'bold'}>*/}
      {/*  CALCULATED PRICE*/}
      {/*</Texto>*/}
      {/*<Texto className={'mt-2'} weight={'bold'}>*/}
      {/*  $2.7510*/}
      {/*</Texto>*/}
      {/*<Texto className={'mt-2'}>*/}
      {/*  Current price. Invoiced prices generated with effective price at time of lifting.*/}
      {/*</Texto>*/}
      {/*<Texto className={'mt-1'}>As of: 10/21/2025 2:45 PM CST</Texto>*/}
      <Texto className={'mt-5'} weight={'bold'}>
        FORMULA COMPONENTS
      </Texto>
      <List
        className='mt-3 formula-components-list'
        dataSource={formulaVariables}
        footer={<Texto weight='bold'>Contract Differential {formatDifferentialAsCurrency(contractDifferential)}</Texto>}
        renderItem={(item) => (
          <List.Item>
            <Texto>{item.DisplayName}</Texto>
          </List.Item>
        )}
      />
    </Vertical>
  )
}
