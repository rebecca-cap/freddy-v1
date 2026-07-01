import { InfoCircleOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Tooltip } from 'antd'
import moment from 'moment'
import React from 'react'

export function LiftingDaysField({ showLiftingDaysForPendingPromptOrder, orderDetails }) {
  return (
    <Horizontal
      className='mt-3 p-2 justify-sb bg-1 bordered border-rounded'
      style={{ borderRadius: 5, fontSize: 12 }}
      verticalCenter
    >
      <Horizontal verticalCenter style={{ minWidth: showLiftingDaysForPendingPromptOrder ? '90px' : '70px' }}>
        <Texto appearance='medium' weight={600}>
          Lifting Days
        </Texto>
        {showLiftingDaysForPendingPromptOrder && (
          <Tooltip title='Dates contingent on order acceptance' trigger='hover'>
            <GraviButton
              className='ghost-gravi-button'
              size='small'
              icon={<InfoCircleOutlined style={{ color: 'var(--gray-500)' }} />}
            />
          </Tooltip>
        )}
      </Horizontal>
      <Texto appearance='medium'>
        {moment(orderDetails?.FromDateTime).format(dateFormat.MONTH_DATE_YEAR_TIME)}
        {' - '}
        {moment(orderDetails?.ToDateTime).format(dateFormat.MONTH_DATE_YEAR_TIME)}
      </Texto>
    </Horizontal>
  )
}
