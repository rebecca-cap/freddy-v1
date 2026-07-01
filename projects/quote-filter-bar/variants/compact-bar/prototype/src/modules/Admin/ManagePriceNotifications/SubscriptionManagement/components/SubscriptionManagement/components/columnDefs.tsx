import { GraviButton, Horizontal, NotificationMessage } from '@gravitate-js/excalibrr'
import {
  MetadataData,
  SubscriptionData,
} from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/api/schema.types'
import {
  getCellStyle,
  getIsRowEditable,
} from '@modules/Admin/ManagePriceNotifications/SubscriptionManagement/components/SubscriptionManagement/components/util'
import { ColDef } from 'ag-grid-community'
import { Switch } from 'antd'
import React from 'react'

interface ColumnDefProps {
  openProductDrawer: (row: SubscriptionData) => void
  openLocationDrawer: (row: SubscriptionData) => void
  canWrite: boolean
  isBulkEditMode: boolean
  bulkEditRows: SubscriptionData[]
  metadata?: MetadataData
}
interface EditableCellProps {
  isBulkEditMode: boolean
  canWrite: boolean
  bulkEditRows: SubscriptionData[]
  metadata?: MetadataData
}
interface EditableLocationCellProps extends EditableCellProps {
  openLocationDrawer: (row: SubscriptionData) => void
}
interface EditableProductCellProps extends EditableCellProps {
  openProductDrawer: (row: SubscriptionData) => void
}

export const getColumnDefs = ({
  openProductDrawer,
  openLocationDrawer,
  canWrite,
  isBulkEditMode,
  bulkEditRows,
  metadata,
}: ColumnDefProps): ColDef[] => {
  const defs = [
    {
      headerName: '',
      field: 'checkbox',
      maxWidth: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      pinned: 'left',
    },
    statusColumn({ canWrite, isBulkEditMode, bulkEditRows }),
    counterpartyColumn({ canWrite, isBulkEditMode, bulkEditRows }),
    quoteConfigColumn({ canWrite, isBulkEditMode, bulkEditRows, metadata }),
    productsColumn({ canWrite, isBulkEditMode, bulkEditRows, openProductDrawer }),
    locationsColumn({ canWrite, isBulkEditMode, bulkEditRows, openLocationDrawer }),
  ]

  return defs as ColDef[]
}

function statusColumn({ isBulkEditMode, canWrite, bulkEditRows }: EditableCellProps) {
  return {
    cellStyle: (params) => getCellStyle({ row: params.data, isBulkEditMode, canWrite, bulkEditRows }),
    headerName: 'Status',
    field: 'IsActive',
    maxWidth: 100,
    cellRenderer: (params) => {
      const editable = getIsRowEditable({ row: params.data, isBulkEditMode, canWrite, bulkEditRows })
      return (
        <Horizontal className='justify-center'>
          <Switch
            className={!editable ? 'disabled-gravi-button-row' : ''}
            checked={params.value}
            onChange={() => {
              if (params.node && editable) {
                const newStatus = !params.value
                params.node.setDataValue('IsActive', newStatus)
              } else {
                NotificationMessage('Not selected', 'Select this row to edit it, or deselect other rows.', true)
              }
            }}
          />
        </Horizontal>
      )
    },
  }
}

function counterpartyColumn({ canWrite, isBulkEditMode, bulkEditRows }: EditableCellProps) {
  return {
    cellStyle: (params) => getCellStyle({ row: params.data, isBulkEditMode, canWrite, bulkEditRows }),
    headerName: 'Counterparty',
    field: 'CounterPartyName',
    width: 250,
    editable: false,
    comparator: (valueA, valueB) => {
      return (valueA || '').toLowerCase().localeCompare((valueB || '').toLowerCase())
    },
    cellRenderer: (params) => {
      return params.data.CounterPartyName
    },
  }
}

function quoteConfigColumn({ canWrite, isBulkEditMode, bulkEditRows, metadata }: EditableCellProps) {
  return {
    cellStyle: (params) => getCellStyle({ row: params.data, isBulkEditMode, canWrite, bulkEditRows }),
    headerName: 'Quote Configuration',
    field: 'QuoteConfigurationId',
    width: 200,
    editable: false,
    valueGetter: (params) => {
      if (!metadata) return ''
      const quoteConfig = metadata?.QuoteConfigurations?.find(
        (item) => item.Value === params.data.QuoteConfigurationId?.toString()
      )
      return quoteConfig ? quoteConfig.Text : ''
    },
  }
}

function productsColumn({ openProductDrawer, canWrite, bulkEditRows, isBulkEditMode }: EditableProductCellProps) {
  return {
    headerName: 'Products',
    field: 'ProductIds',
    cellRenderer: (params) => {
      const productCount = Array.isArray(params.value) ? params.value.length : 0
      const buttonText = productCount > 0 ? `${productCount} selected` : 'None selected'
      const editable = getIsRowEditable({ row: params.data, isBulkEditMode, canWrite, bulkEditRows })
      return (
        <Horizontal className='justify-center'>
          <GraviButton
            onClick={() => {
              if (editable) openProductDrawer(params.data)
              else {
                NotificationMessage('Not selected', 'Select this row to edit it, or deselect other rows.', true)
              }
            }}
            buttonText={buttonText}
            className={`px - 2 py-0 h-8 border-radius-5 in-cell-product-location-edit-buttons ${
              !editable ? 'disabled-gravi-button-row' : ''
            }`}
            theme3={productCount > 0}
            size='small'
          />
        </Horizontal>
      )
    },
    editable: false,
    filter: false,
    filterParams: {
      valueGetter: (params) => {
        if (!params.data?.Products?.length) return ''
        if (typeof params.data.Products[0] === 'string') {
          return params.data.Products
        }
        return params.data.Products.map((p) => p.Name)
      },
    },
  }
}

function locationsColumn({ isBulkEditMode, canWrite, bulkEditRows, openLocationDrawer }: EditableLocationCellProps) {
  return {
    cellStyle: (params) => getCellStyle({ row: params.data, isBulkEditMode, canWrite, bulkEditRows }),
    headerName: 'Locations',
    field: 'LocationIds',
    cellRenderer: (params) => {
      const locationCount = Array.isArray(params.value) ? params.value.length : 0
      const buttonText = locationCount > 0 ? `${locationCount} selected` : 'None selected'
      const editable = getIsRowEditable({ row: params.data, isBulkEditMode, canWrite, bulkEditRows })
      return (
        <Horizontal className='justify-center'>
          <GraviButton
            onClick={() => {
              if (editable) openLocationDrawer(params.data)
              else {
                NotificationMessage('Not selected', 'Select this row to edit it, or deselect other rows.', true)
              }
            }}
            buttonText={buttonText}
            className={`px - 2 py-0 h-8 border-radius-5 in-cell-product-location-edit-buttons ${
              !editable ? 'disabled-gravi-button-row' : ''
            }`}
            theme3={locationCount > 0}
            size='small'
          />
        </Horizontal>
      )
    },
    editable: false,
    filter: false,
    filterParams: {
      valueGetter: (params) => {
        if (!params.data?.Locations?.length) return ''
        if (typeof params.data.Locations[0] === 'string') {
          return params.data.Locations
        }
        return params.data.Locations.map((l) => l.Name)
      },
    },
  }
}
