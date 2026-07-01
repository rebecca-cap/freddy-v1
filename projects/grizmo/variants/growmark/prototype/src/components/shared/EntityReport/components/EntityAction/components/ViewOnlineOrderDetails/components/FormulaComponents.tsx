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

  if (!orderDetails?.SourceIndexOfferId) return null

  return (
    <div className='flex-half'>
      <Vertical className='mx-4'>
        <Horizontal className='border-bottom mb-4'>
          <Texto category='h5' appearance='medium'>
            FORMULA COMPONENTS
          </Texto>
        </Horizontal>
        <List
          className='formula-components-list'
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
                Contract Differential {fmt.currency(indexOfferDisplay?.ContractDifferential) ?? 'N/A'}
              </Texto>
            </div>
          }
        />
      </Vertical>
    </div>
  )
}
