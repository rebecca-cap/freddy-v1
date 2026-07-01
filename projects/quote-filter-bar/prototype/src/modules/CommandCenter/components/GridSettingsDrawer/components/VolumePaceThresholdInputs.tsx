import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'

import { thresholdItemTypes } from '../utils'
import { AlertInputItem } from './AlertInputItem'

export function VolumePaceThresholdInputs({ activeTab }: { activeTab: string }) {
  if (activeTab === 'Daily') {
    return <VolumePaceThresholdInputsDaily />
  }
  const tabs = ['Weekly', 'Monthly']
  return (
    <Vertical>
      {tabs.map((tab) => (
        <VolumePaceThresholdInput key={tab} activeTab={activeTab} thisTab={tab} />
      ))}
    </Vertical>
  )
}

export function VolumePaceThresholdInputsDaily() {
  return (
    <Vertical className='p-4 bg-2 bordered mt-4' horizontalCenter verticalCenter>
      <Texto category='h6'>No Thresholds Available</Texto>
      <Texto category='p1' className='mt-2'>
        Daily volume is too volatile for meaningful thresholds. A single truck delivery can change pace from 0% to 100%
        instantly.
      </Texto>
    </Vertical>
  )
}

export function VolumePaceThresholdInput({ activeTab, thisTab }: { activeTab: string; thisTab: string }) {
  return (
    <Vertical
      className='my-2'
      style={{ display: activeTab.toLowerCase().includes(thisTab.toLowerCase()) ? 'block' : 'none' }}
    >
      <Horizontal justifyContent='space-between' className='my-2' style={{ gap: '10px' }}>
        {thresholdItemTypes.slice(0, 2).map((item) => (
          <AlertInputItem
            title={item}
            key={`${thisTab}${item}`}
            settingsProperty={`${thisTab?.toLowerCase()}${item.replace(' ', '')}`}
            label={'Critical'}
            addOnAfter='%'
            min={0}
          />
        ))}
      </Horizontal>
      <Horizontal justifyContent='space-between' className='my-2' style={{ gap: '10px' }}>
        {thresholdItemTypes.slice(2, 4).map((item) => (
          <AlertInputItem
            title={item}
            key={`${thisTab}${item}`}
            settingsProperty={`${thisTab?.toLowerCase()}${item.replace(' ', '')}`}
            label={'At Risk'}
            addOnAfter='%'
            min={0}
          />
        ))}
      </Horizontal>
    </Vertical>
  )
}
