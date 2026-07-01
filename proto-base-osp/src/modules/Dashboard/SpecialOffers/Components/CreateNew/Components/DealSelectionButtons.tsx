import { CheckCircleFilled } from '@ant-design/icons'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Button } from 'antd'
import type { ReactNode } from 'react'

interface DealSelectionButtonsItem<T extends string | number = string | number> {
  id: T
  label: string
  description: string
  icon?: ReactNode
  iconSelected?: ReactNode
}

interface DealSelectionButtonsProps<T extends string | number = string | number> {
  item: DealSelectionButtonsItem<T>
  selectedId: T | undefined
  onSelect: (id: T) => void
  variant?: 'deal' | 'subtype'
}

export function DealSelectionButtons({ item, selectedId, onSelect, variant = 'deal' }: DealSelectionButtonsProps) {
  const isSelected = selectedId === item.id
  const isDeal = variant === 'deal'

  return (
    <Vertical flex={1}>
      <Vertical
        alignItems={isDeal ? 'flex-end' : 'flex-start'}
        style={{ overflow: 'visible', visibility: isSelected ? 'visible' : 'hidden', height: '5px' }}
      >
        <CheckCircleFilled
          style={{
            fontSize: '24px',
            position: 'relative',
            ...(isDeal ? { bottom: '0px', right: '0px' } : { left: '0px', top: '0px' }),
            zIndex: 2,
            color: 'var(--theme-color-1)',
          }}
        />
      </Vertical>

      <Button
        className='border-radius-10 p-2'
        style={{
          height: '100%',
          width: '100%',
          minHeight: isDeal ? '130px' : '80px',
          overflow: 'hidden',
          color: isSelected ? 'var(--theme-color-1)' : 'inherit',
          backgroundColor: isSelected ? 'var(--bg-2)' : 'var(--bg-1)',
          borderColor: isSelected ? 'var(--theme-color-1)' : undefined,
          justifyContent: 'flex-start',
        }}
        onClick={() => onSelect(item.id)}
      >
        <Horizontal justifyContent={'flex-start'}>
          {isDeal && item.icon && (
            <Horizontal horizontalCenter className='mr-2 mt-2' style={{ minWidth: '50px' }}>
              {isSelected ? item.iconSelected : item.icon}
            </Horizontal>
          )}
          <Vertical className={isDeal ? 'mt-1' : 'mt-1 ml-5 mb-1'}>
            <Texto category='h5' style={{ color: 'inherit' }} className={isDeal ? 'text-18 mb-1' : undefined}>
              {item.label}
            </Texto>
            <Texto
              weight='normal'
              style={{ whiteSpace: 'break-spaces', minHeight: '40px' }}
              className={isDeal ? 'text-14' : undefined}
            >
              {item.description}
            </Texto>
          </Vertical>
        </Horizontal>
      </Button>
    </Vertical>
  )
}
