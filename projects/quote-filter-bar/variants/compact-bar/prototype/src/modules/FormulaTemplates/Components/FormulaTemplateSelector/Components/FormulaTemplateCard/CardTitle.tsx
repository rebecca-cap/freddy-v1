import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Tag } from 'antd'
interface CardTitleProps {
  name: string | null
  hasPlaceholders?: boolean
}
export function CardTitle({ name, hasPlaceholders = false }: CardTitleProps) {
  return (
    <Horizontal verticalCenter justifyContent={'space-between'}>
      <Texto weight='bold' className='template-card-title' category={'h6'}>
        {name}
      </Texto>
      {hasPlaceholders && (
        <Tag
          style={{
            backgroundColor: 'var(--placeholder-color-dim, #f3e8ff)',
            color: 'var(--placeholder-color, #722ed1)',
            border: '1px solid var(--placeholder-color, #722ed1)',
            borderRadius: 4,
            fontSize: 9,
            fontWeight: 600,
          }}
        >
          PLACEHOLDERS
        </Tag>
      )}
    </Horizontal>
  )
}
