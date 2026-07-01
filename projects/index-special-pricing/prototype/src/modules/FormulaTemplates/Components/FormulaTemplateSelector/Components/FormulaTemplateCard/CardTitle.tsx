import { PLACEHOLDER_COLORS } from '@constants/colors'
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
            backgroundColor: PLACEHOLDER_COLORS.bg,
            color: PLACEHOLDER_COLORS.text,
            border: `1px solid ${PLACEHOLDER_COLORS.text}`,
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
