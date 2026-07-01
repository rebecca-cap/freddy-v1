import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'

import { thresholdItemTypes } from '../utils'
import { AlertInputItem } from './AlertInputItem'

export function StrategyDeltaThresholds() {
  const categories = [{ label: 'Delta to Strategy', property: 'missToStrategy', addOnBefore: '$' }]
  return (
    <Vertical>
      {categories.map((category) => (
        <Vertical key={category.label} className='my-4'>
          <Texto category='h6' className='mb-2'>
            {category.label} Thresholds
          </Texto>
          {thresholdItemTypes.map((item) => (
            <Horizontal key={item}>
              <AlertInputItem
                settingsProperty={`${category.property}${item.replace(' ', '')}`}
                label={item}
                addOnBefore={category.addOnBefore}
              />
            </Horizontal>
          ))}
        </Vertical>
      ))}
    </Vertical>
  )
}
