import type { FC, ReactNode } from 'react'
import { Button, Tooltip } from 'antd'
import { PaperClipOutlined } from '@ant-design/icons'

type Props = {
  hoverTitle: string
  icon: ReactNode
  onClick: (...args: any[]) => void
}
export const IconButton: FC<Props> = ({ hoverTitle, icon, onClick }) => {
  return (
    <div className='vertical-flex-center pr-3 '>
      <Tooltip title={hoverTitle} mouseEnterDelay={0.5} placement='bottom'>
        <Button
          className='info-button'
          shape='circle'
          icon={icon ?? <PaperClipOutlined />}
          onClick={onClick}
        />
      </Tooltip>
    </div>
  )
}
