import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons'
import { BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Badge } from 'antd'
import React from 'react'

function SuccessTag() {
  return (
    <Horizontal className='round-border bg-success p-2' verticalCenter horizontalCenter>
      <CheckCircleFilled style={{ color: 'white', paddingRight: 5, fontSize: 15 }} />
      <Texto style={{ color: 'white', fontSize: 15 }}>Success</Texto>
    </Horizontal>
  )
}

function ErrorTag({ setUploadErrors, data }) {
  return (
    <Horizontal
      className='round-border bg-error p-2'
      verticalCenter
      horizontalCenter
      onClick={() => setUploadErrors(data?.Validations)}
    >
      <ExclamationCircleFilled style={{ color: 'white', paddingRight: 5, fontSize: 15 }} />
      <Texto style={{ color: 'white', fontSize: 15 }}>ERROR</Texto>
    </Horizontal>
  )
}

export const getColumnDefs = (setUploadErrors) => [
  {
    field: 'HasErrors',
    headerName: 'Status',
    cellRenderer: ({ data }) => {
      const errorCount = data?.Validations?.length
      if (!data || errorCount > 0) {
        return (
          <Badge count={data?.ValidationMessages?.length}>
            <ErrorTag setUploadErrors={setUploadErrors} data={data} />
          </Badge>
        )
      }
      return <SuccessTag />
    },
  },
  {
    field: 'CounterParty',
    valueGetter: (params) => {
      return (
        params.data.Item.SupplierCounterPartyName ??
        params.data.Item.CarrierCounterPartyName ??
        params.data.Item.InternalCounterPartyName ??
        params.data.Item.ExternalCounterPartyName
      )
    },
  },
  {
    field: 'ProductName',
    valueGetter: (params) => params.data.Item.ProductName,
  },
  {
    field: 'LocationName',
    valueGetter: (params) => params.data.Item.LocationName,
  },
  {
    field: 'PricePeriodStartOffset',
    valueGetter: (params) => params.data.Item.PricePeriodStartOffset,
  },
  {
    field: 'QuoteStrategyDiff',
    valueGetter: (params) => params.data.Item.QuoteStrategyDiff,
  },
  {
    field: 'UnitOfMeasureName',
    valueGetter: (params) => params.data.Item.UnitOfMeasureName,
  },
  {
    field: 'IsActive',
    valueGetter: (params) => params.data.Item.IsActive,
    cellRenderer: ({ value }) =>
      value ? (
        <BBDTag success style={{ textAlign: 'center', width: 80 }}>
          Active
        </BBDTag>
      ) : (
        <BBDTag error style={{ textAlign: 'center', width: 80 }}>
          Inactive
        </BBDTag>
      ),
  },
  {
    field: 'StatusCvId',
    cellRenderer: ({ data }) => {
      if (data.Item.StatusCvId === 100) {
        return (
          <BBDTag success style={{ textAlign: 'center', width: 80 }}>
            Enabled
          </BBDTag>
        )
      }
      return (
        <BBDTag error style={{ textAlign: 'center', width: 80 }}>
          Disabled
        </BBDTag>
      )
    },
  },
]
