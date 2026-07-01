import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Form, Radio, RadioChangeEvent } from 'antd'
import { useState } from 'react'

import { VolumePaceThresholdInputs } from './VolumePaceThresholdInputs'

export function VolumePaceThresholdTabs() {
  const [activeTab, setActiveTab] = useState('Weekly')
  const tabs = [
    {
      key: 'Weekly',
    },
    {
      key: 'Monthly',
    },
    {
      key: 'Daily',
    },
  ]
  return (
    <Vertical>
      <Texto category='h6' className='mb-2'>
        Pace Thresholds
      </Texto>
      <Form.Item name='thresholdTimeRange'>
        <Radio.Group
          value={activeTab || 'Weekly'}
          onChange={(e: RadioChangeEvent) => setActiveTab(e.target.value)}
          style={{ width: '100%', margin: 0, padding: 0 }}
        >
          {tabs.map((tab) => (
            <Radio.Button key={tab.key} value={tab.key} style={{ width: '33%', textAlign: 'center' }}>
              {tab.key}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>

      <VolumePaceThresholdInputs activeTab={activeTab || 'Weekly'} />
      <Vertical className='p-4 bg-3 bordered mt-4' verticalCenter>
        <Texto category='h6'>Volume Pace Status</Texto>

        <Horizontal>
          &#x2022;
          <Texto weight='bold' className='mx-2'>
            Critical:
          </Texto>
          <Texto>Significantly behind target, immediate action needed</Texto>
        </Horizontal>
        <Horizontal>
          &#x2022;
          <Texto weight='bold' className='mx-2' style={{ whiteSpace: 'nowrap' }}>
            At Risk:
          </Texto>
          <Texto>Below target, monitoring required</Texto>
        </Horizontal>
        <Horizontal>
          &#x2022;
          <Texto weight='bold' className='mx-2' style={{ whiteSpace: 'nowrap' }}>
            On Track:
          </Texto>
          <Texto>Meeting expectations (calculated between warning thresholds)</Texto>
        </Horizontal>
      </Vertical>
    </Vertical>
  )
}
