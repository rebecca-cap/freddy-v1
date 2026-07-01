import { GraviButton } from '@gravitate-js/excalibrr'
import { Tooltip } from 'antd'
import React from 'react'

export function columnDefinitions(handleVolumeUpdate, selectedSubtype, orderEntryInfo) {
  const isInternalUser = orderEntryInfo?.Data?.IsInternalUser
  const isPullAnytime = selectedSubtype.VolumeDistributionTypeMeaning === 'PullAnytime'
  const isPriceEditable = !isPullAnytime && isInternalUser

  const columnConfig = {
    resizable: false,
    suppressMenu: true,
    suppressColumnsToolPanel: true,
    filter: false,
    sortable: false,
  }
  const columnDefs = [
    {
      headerName: 'Delivery Period',
      field: 'DisplayName',
      ...columnConfig,
      flex: 1,
    },
  ]

  if (!isPullAnytime) {
    columnDefs.push({
      headerName: 'Monthly Price',
      field: 'Price',
      editable: isPriceEditable,
      cellEditor: 'number',
      cellEditorParams: {
        max: 999999999,
        min: 0,
      },
      cellEditorPopup: false,
      valueFormatter: fmt.currency,
      onCellValueChanged: (params) => {
        handleVolumeUpdate(params.data, 'Price')
      },
      ...columnConfig,
      flex: 1,
    })
    columnDefs.push({
      ...columnConfig,
      headerName: 'Gallons',
      field: 'orderVolume',
      editable: true,
      cellEditor: 'number',
      cellEditorParams: {
        max: 999999999,
        min: 0,
      },
      cellEditorPopup: false,
      flex: 1,
      // valueFormatter: ({ value }) => fmt.decimal(value, 0),
      onCellValueChanged: (params) => {
        handleVolumeUpdate(params.data, 'orderVolume')
      },
      cellRenderer: ({ data }) => {
        const volume = data?.orderVolume
        if (volume === undefined || volume === null) {
          return ''
        }
        const errors = []
        if (data?.Constraints?.MinMonthlyVolume > volume) {
          errors.push('Monthly Min: ' + fmt.decimal(data?.Constraints.MinMonthlyVolume, 0))
        }
        if (data?.Constraints?.MaxMonthlyVolume < volume) {
          errors.push(`Monthly Max:  ${fmt.decimal(data.Constraints.MaxMonthlyVolume, 0)}`)
        }
        if (errors.length > 0) {
          return (
            <Tooltip trigger={'hover'} title={errors.join(', ')} placement='topLeft'>
              <GraviButton
                className='ghost-gravi-button'
                style={{ color: 'var(--theme-error)', textAlign: 'left', padding: 0 }}
                buttonText={fmt.decimal(volume, 0)}
              />
            </Tooltip>
          )
        }
        return fmt.decimal(data.orderVolume, 0)
      },
    })
  }

  return columnDefs
}
