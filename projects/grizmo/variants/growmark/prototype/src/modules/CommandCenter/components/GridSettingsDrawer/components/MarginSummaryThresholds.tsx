import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'

import { thresholdItemTypes } from '../utils'
import { AlertInputItem } from './AlertInputItem'

export function MarginSummaryThresholds() {
  const categories = [{ label: 'Margin', property: '', addOnBefore: '$' }]
  return (
    <Vertical>
      {categories.map((category) => (
        <Vertical key={category.label} className='my-4'>
          <Texto category='h6' className='mb-2'>
            {category.label} Thresholds
          </Texto>
          {thresholdItemTypes.map((item) => {
            const property = `${item.charAt(0).toLowerCase()}${item.replace(' ', '').slice(1)}`

            return (
              <Horizontal key={item}>
                <AlertInputItem settingsProperty={property} label={item} addOnBefore={category.addOnBefore} />
              </Horizontal>
            )
          })}
        </Vertical>
      ))}
    </Vertical>
  )
}
