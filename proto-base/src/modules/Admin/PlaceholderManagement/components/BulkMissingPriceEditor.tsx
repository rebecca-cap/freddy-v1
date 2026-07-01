import { HighlightOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { BulkCellEditorHandle } from '@gravitate-js/excalibrr/dist/components/GraviGrid/index.types'
import { InputNumber, Tooltip } from 'antd'
import React, { forwardRef, useState } from 'react'

export const BulkMissingPriceEditor = forwardRef<BulkCellEditorHandle<any>>((props: any, _) => {
  const [price, setPrice] = useState()

  const add = (row) => ({
    ...row,
    Price: (row.Price || 0) + (price || 1),
  })

  const subtract = (row) => ({
    ...row,
    Price: (row.Price || 0) - (price || 1),
  })

  const replace = (row) => {
    return {
      ...row,
      Price: price,
    }
  }

  return (
    <Horizontal flex={1} style={{ gap: '1rem' }} alignItems='center' justifyContent='flex-end'>
      <InputNumber
        value={price}
        onChange={(value) => setPrice(value === 0 || value === '' ? null : value)}
        style={{ width: 180 }}
      />
      <Horizontal style={{ gap: 4 }}>
        <GraviButton icon={<PlusOutlined />} onClick={() => props.executeChange(add)} />
        <GraviButton icon={<MinusOutlined />} onClick={() => props.executeChange(subtract)} />
        <Tooltip title='Replace value' placement='bottomLeft'>
          <GraviButton icon={<HighlightOutlined />} onClick={() => props.executeChange(replace)} />
        </Tooltip>
      </Horizontal>
    </Horizontal>
  )
})
