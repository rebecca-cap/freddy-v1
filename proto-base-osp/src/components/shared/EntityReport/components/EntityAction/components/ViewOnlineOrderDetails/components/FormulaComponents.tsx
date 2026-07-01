import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Model } from '@hooks/useOnlineOrderViewTypes'
import { List } from 'antd'
import React from 'react'

interface FormulaComponentsProps {
  orderDetails: Model
}

export function FormulaComponents({ orderDetails }: FormulaComponentsProps) {
  const indexOfferDisplay = orderDetails?.IndexOfferDisplay
  const formulaVariables = (indexOfferDisplay?.FormulaVariables ?? []).filter(
    (v) => v.VariableName !== 'ContractDifferential'
  )
  const isBid = orderDetails?.IsBidOrOffer ?? false

  if (!orderDetails?.SourceIndexOfferId) return null

  return (
    <div className='flex-half'>
      <Vertical className='mx-4 mb-4'>
        <Horizontal className='border-bottom '>
          <Texto category='h5' appearance='medium'>
            FORMULA COMPONENTS
          </Texto>
        </Horizontal>
        <List
          className='formula-components-list my-3'
          dataSource={formulaVariables}
          header={
            <div className='formula-components-row'>
              <Texto weight='bold' className='formula-col-name'>
                Variables
              </Texto>
            </div>
          }
          renderItem={(item) => (
            <List.Item className='formula-components-row'>
              <Texto className='formula-col-name'>{item.VariableDisplayName}</Texto>
            </List.Item>
          )}
          footer={
            <div className='formula-components-row'>
              <Texto weight='bold' className='formula-col-name'>
                Contract Differential:{' '}
                {isBid
                  ? 'Bid'
                  : indexOfferDisplay?.ContractDifferential
                  ? fmt.currency(indexOfferDisplay?.ContractDifferential)
                  : 'N/A'}
              </Texto>
            </div>
          }
        />
      </Vertical>
    </div>
  )
}
