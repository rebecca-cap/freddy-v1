import { BarChartOutlined, LineChartOutlined } from '@ant-design/icons'
import { usePromptContext } from '@contexts/PromptContext'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Form, Radio } from 'antd'
import React from 'react'

export function PurchaseType() {
  const { setPendingTrade, allowBid } = usePromptContext()
  return (
    <Horizontal className=' px-4 py-3 justify-sb' verticalCenter>
      <Texto category='h6' appearance='default'>
        Purchase Type
      </Texto>
      <Form.Item name='Type' noStyle>
        <Radio.Group
          buttonStyle='solid'
          className='test-Type'
          onChange={(e) =>
            setPendingTrade((prev) => {
              return { ...prev, Type: e.target.value }
            })
          }
        >
          <Radio.Button style={{ minWidth: 80, textAlign: 'center' }} value='market' key='market'>
            <BarChartOutlined /> Market
          </Radio.Button>
          {allowBid && (
            <Radio.Button style={{ minWidth: 80, textAlign: 'center' }} value='bid' key='bid'>
              <LineChartOutlined /> Bid
            </Radio.Button>
          )}
        </Radio.Group>
      </Form.Item>
    </Horizontal>
  )
}
