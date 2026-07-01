import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { BBDTag, validateNotEmptyString } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import moment from 'moment'
import React from 'react'

export const getColumnDefs = (selectedInstrument, deliveryPeriodGroups, canWrite) => {
  const columns: ColDef[] = []
  const columnsToAdd = []
  const dateFormat = 'MMM DD, YYYY'
  const futureMonth = 'MMM YYYY'

  if (selectedInstrument?.TradeTypeMeaning?.includes('Forward')) {
    columnsToAdd.push(
      {
        headerName: 'Delivery Period Name',
        field: 'DeliveryPeriodName',
        minWidth: 180,
        editable: canWrite,
        required: true,
        valueSetter: validateNotEmptyString,
      },
      {
        headerName: 'Delivery Start',
        field: 'DeliveryPeriodFromDateTime',
        cellEditor: 'DateEditor',
        valueGetter: (params) => moment(params.data.DeliveryPeriodFromDateTime),
        cellEditorParams: (params) => ({ defaultValue: params.data.DeliveryPeriodFromDateTime }),
        cellRenderer: ({ value }) => moment(value).format(dateFormat),
        filter: 'agDateColumnFilter',
      },
      {
        headerName: 'Delivery End',
        field: 'DeliveryPeriodToDateTime',
        cellEditor: 'DateEditor',
        valueGetter: (params) => moment(params.data.DeliveryPeriodToDateTime),
        cellEditorParams: (params) => ({ defaultValue: params.data.DeliveryPeriodToDateTime }),
        cellRenderer: ({ value }) => moment(value).format(dateFormat),
        filter: 'agDateColumnFilter',
      }
    )
  }

  columns.push(
    {
      headerName: 'Effective Start',
      field: 'EffectiveFromDateTime',
      cellEditor: 'DateEditor',
      cellEditorParams: (params) => ({ defaultValue: params.data.EffectiveFromDateTime }),
      valueGetter: (params) => moment(params.data.EffectiveFromDateTime),
      cellRenderer: ({ value }) => moment(value).format(dateFormat),
      filter: 'agDateColumnFilter',
    },
    {
      headerName: 'Effective End',
      field: 'EffectiveToDateTime',
      cellEditor: 'DateEditor',
      valueGetter: (params) => moment(params.data.EffectiveToDateTime),
      cellEditorParams: (params) => ({ defaultValue: params.data.EffectiveToDateTime }),
      cellRenderer: ({ value }) => moment(value).format(dateFormat),
      filter: 'agDateColumnFilter',
    },
    ...columnsToAdd,
    {
      headerName: 'Futures Month',
      field: 'FutureMonth',
      cellEditor: 'DateEditor',
      valueGetter: (params) => moment(params.data.FutureMonth),
      cellEditorParams: (params) => ({ defaultValue: params.data.FutureMonth, picker: 'month' }),
      cellRenderer: ({ value }) => moment(value).format(futureMonth),
      filter: 'agDateColumnFilter',
    }
  )

  if (selectedInstrument?.HasDeliveryPeriodGroups) {
    columns.push({
      headerName: 'Delivery Period Group',
      field: 'DeliveryPeriodGroupId',
      flex: 1,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      editable: canWrite,
      cellEditorParams: {
        options: deliveryPeriodGroups?.map((item) => {
          return {
            value: item.Value,
            label: item.Text,
          }
        }),
        allowClear: true,
      },
      valueGetter: (props) => {
        if (props?.data?.DeliveryPeriodGroupId) {
          return deliveryPeriodGroups?.find((option) => option.Value === props?.data?.DeliveryPeriodGroupId.toString())
            ?.Text
        }
        return 'None'
      },
    })
  }

  columns.unshift({
    headerName: 'Status',
    field: 'IsActive',
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    maxWidth: 120,
    cellEditorParams: {
      options: [
        {
          value: true,
          label: 'Active',
        },
        {
          value: false,
          label: 'Inactive',
        },
      ],
      showSearch: false,
    },
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
  })

  return columns
}
