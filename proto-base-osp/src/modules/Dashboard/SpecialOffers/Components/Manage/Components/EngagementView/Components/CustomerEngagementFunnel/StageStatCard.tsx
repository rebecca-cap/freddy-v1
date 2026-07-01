import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Card } from 'antd'
import React from 'react'

export type StageStatCardProps = {
  step: number
  title: string
  count: number | string
  percent?: number
  lostText?: string
  onViewCustomers?: () => void
  viewLinkText?: string
  className?: string
}

export function StageStatCard({
  step,
  title,
  count,
  percent,
  lostText,
  onViewCustomers,
  viewLinkText = 'View customers →',
  className,
}: StageStatCardProps) {
  const showPercent = typeof percent === 'number' && !Number.isNaN(percent)

  return (
    <Card className={`funnel-card ${className ?? ''}`} onClick={onViewCustomers}>
      <Vertical gap={10}>
        {/* Header: step badge + title */}
        <Horizontal gap={8} verticalCenter>
          <span className='funnel-card__step'>{step}</span>
          <Texto className={'ml-2'} weight='600'>
            {title}
          </Texto>
        </Horizontal>

        {/* Count + percent */}
        <Horizontal style={{ alignItems: 'center' }}>
          <Texto category='h2' weight='700'>
            {count}
          </Texto>

          {showPercent && (
            <Vertical className={'ml-4'}>
              <Texto category={'h5'} className='funnel-card__percent' weight='700'>
                {fmt.decimal(percent, 0)}%
              </Texto>
              {/*{lostText && <Texto className='opacity-70'>({lostText})</Texto>}*/}
            </Vertical>
          )}
        </Horizontal>

        {/* Link */}
        <Horizontal justifyContent='flex-end'>
          <Texto className='funnel-card-link'>{viewLinkText}</Texto>
        </Horizontal>
      </Vertical>
    </Card>
  )
}
