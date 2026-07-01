import { HighlightOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { GridApi } from 'ag-grid-community'
import { InputNumber, Tooltip } from 'antd'
import { MutableRefObject, useState } from 'react'

import { handleCellChange } from '../events'

export type CellAction = 'add' | 'subtract' | 'replace'

interface PeriodValueEditorProps {
  gridRef: MutableRefObject<GridApi>
  dirtyRef: MutableRefObject<any>
}
export function PeriodValueEditor({ gridRef, dirtyRef }: PeriodValueEditorProps) {
  const [value, setValue] = useState<number | null>(1)

  return (
    <Horizontal style={{ gap: 8 }}>
      <InputNumber min={0} value={value} onChange={(v) => setValue(v)} style={{ width: 140 }} />
      <Horizontal style={{ gap: 4 }}>
        <GraviButton
          icon={<PlusOutlined />}
          onClick={() => handleCellChange(gridRef, value, 'add', dirtyRef)}
          disabled={!value}
        />
        <GraviButton
          icon={<MinusOutlined />}
          onClick={() => handleCellChange(gridRef, value, 'subtract', dirtyRef)}
          disabled={!value}
        />
        <Tooltip title='Replace value' placement='bottomLeft'>
          <GraviButton
            icon={<HighlightOutlined />}
            onClick={() => handleCellChange(gridRef, value, 'replace', dirtyRef)}
          />
        </Tooltip>
      </Horizontal>
    </Horizontal>
  )
}
