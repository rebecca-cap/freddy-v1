import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Popover } from 'antd'
import React from 'react'

export function HoverPopoverList({ list, title }: { list: string[]; title: string | React.ReactNode }) {
  if (!list?.length) {
    return <Texto>None</Texto>
  }
  if (list?.length === 1) {
    return <Texto>{list}</Texto>
  }
  return (
    <Popover
      placement='bottomLeft'
      content={
        <Vertical>
          {list?.map((item) => (
            <Horizontal key={item}>
              <Texto>{item}</Texto>
            </Horizontal>
          ))}
        </Vertical>
      }
    >
      {title}
    </Popover>
  )
}
