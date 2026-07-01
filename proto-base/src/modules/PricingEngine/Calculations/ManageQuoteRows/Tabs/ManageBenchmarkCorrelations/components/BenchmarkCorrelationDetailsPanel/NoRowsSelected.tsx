import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Empty } from 'antd'
import React from 'react'

export function NoRowsSelected() {
  return (
    <Horizontal className='bg-2' fullHeight>
      <Vertical>
        <Horizontal className='bordered bg-2' style={{ padding: 16 }}>
          <Texto category='h6'>Benchmark Details</Texto>
        </Horizontal>
        <Horizontal className='bordered bg-2' style={{ padding: 16 }} horizontalCenter fullHeight>
          <Empty description={null} style={{ marginTop: 100 }}>
            <Vertical horizontalCenter>
              <Texto>No Products Selected</Texto>
              <Texto>Select a product to see any assigned benchmarks</Texto>
            </Vertical>
          </Empty>
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}
