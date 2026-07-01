import { dateFormat } from '@components/TheArmory/helpers'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import moment from 'moment'
import React from 'react'

export function ValidationIssues({ orderDetails }) {
  if (!orderDetails?.IsInternalUser) {
    return <div />
  }

  return (
    <div className='flex-half'>
      <Vertical className='m-4'>
        <Horizontal className='border-bottom'>
          <Texto category='h5' appearance='medium'>
            VALIDATION ISSUES
          </Texto>
        </Horizontal>
        <Horizontal className='mt-3 justify-sb' style={{ borderRadius: 5, fontSize: 12 }}>
          <Vertical>
            <Horizontal className='justify-sb p-2 bg-1 bordered border-rounded' style={{ borderRadius: 5 }}>
              <Texto appearance='medium' weight={600}>
                Export Status
              </Texto>
              <Texto appearance='medium'>{orderDetails?.ExportProcessStatusCodeValueDisplay || 'N/A'}</Texto>
            </Horizontal>
            <Horizontal className='justify-sb p-2 mt-3 bg-1 bordered border-rounded' style={{ borderRadius: 5 }}>
              <Texto appearance='medium' weight={600}>
                Export Date
              </Texto>
              <Texto appearance='medium'>
                {orderDetails?.ExportDateTime
                  ? moment(orderDetails?.ExportDateTime)?.format(dateFormat.MONTH_DATE_YEAR_TIME)
                  : 'N/A'}
              </Texto>
            </Horizontal>
            <Horizontal className='justify-sb p-2 mt-3 bg-1 bordered border-rounded' style={{ borderRadius: 5 }}>
              <Texto appearance='medium' weight={600}>
                External Status
              </Texto>
              <Texto appearance='medium'>{orderDetails?.ExternalProcessStatusCodeValueDisplay || 'N/A'}</Texto>
            </Horizontal>
          </Vertical>
        </Horizontal>
      </Vertical>
    </div>
  )
}
