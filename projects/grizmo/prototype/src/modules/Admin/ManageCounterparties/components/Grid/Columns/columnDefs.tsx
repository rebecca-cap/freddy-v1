import '../../../../../../styles.css'

import { EditOutlined } from '@ant-design/icons'
import { CounterPartyMetadataResponse } from '@api/useCounterparties/types'
import { BulkSelectEditor } from '@components/shared/Grid/bulkChange/bulkCellEditors'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { CREDIT_STATUS_COLOR } from '@components/TheArmory/helpers'
import { BBDTag, Texto } from '@gravitate-js/excalibrr'
import { CREDIT_STATUS_INFO_MAP } from '@modules/Admin/ManageCounterparties/components/ManagementPane/ManageCounterpartiesCreditTab/utils'
import { isDefinedAndNotNull, toAntOption } from '@utils/index'
import { ColDef } from 'ag-grid-community'
import { Button, Tooltip } from 'antd'
import React from 'react'

interface IColumnDefProps {
  initializeSourceModal: (any) => void
  metadata: CounterPartyMetadataResponse['Data'] | undefined
  canWrite: boolean
}

export const getCounterpartyColumnDefs = ({ initializeSourceModal, metadata, canWrite }: IColumnDefProps) => {
  const creditStatuses = metadata?.CreditStatusList ?? []

  return [
    {
      minWidth: 180,
      editable: false,
      headerName: 'Source',
      sortable: false,
      filterValueGetter: ({ data }) => data?.SourceInfo?.SourceId || data?.SourceInfo?.SourceIdString,
      colId: 'sourceInfo',
      cellRenderer: (params) => {
        const SourceInfo = params?.data?.SourceInfo
        const SourceId = SourceInfo?.SourceId
        const SourceSystemId = SourceInfo?.SourceSystemId
        const SourceIdString = SourceInfo?.SourceIdString
        const sourceSystem = metadata?.EditableSources?.find((item) => item.Value === SourceSystemId?.toString())

        if (!SourceId && !SourceSystemId && canWrite) {
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type='text'
                style={{ color: 'var(--theme-color-2)', minWidth: 175 }}
                onClick={() => initializeSourceModal(params?.data)}
              >
                + Add Source
              </Button>
            </div>
          )
        }
        if (sourceSystem !== undefined && canWrite) {
          return (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button.Group>
                <Button type='link' style={{ pointerEvents: 'none', minWidth: 140, color: 'black' }}>
                  {params?.data?.SourceInfo?.SourceId || params?.data?.SourceInfo?.SourceIdString}
                </Button>
                <Button icon={<EditOutlined />} onClick={() => initializeSourceModal(params?.data)} />
              </Button.Group>
            </div>
          )
        }
        return (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button.Group>
              <Button type='link' style={{ pointerEvents: 'none', minWidth: 140, color: 'black' }}>
                {params?.data?.SourceInfo?.SourceId || params?.data?.SourceInfo?.SourceIdString}
              </Button>
            </Button.Group>
          </div>
        )
      },
    },
    {
      field: 'IsActive',
      headerName: 'Status',
      isBulkEditable: canWrite,
      bulkCellEditor: BulkSelectEditor,
      bulkCellEditorParams: {
        propKey: 'IsActive',
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
      },
      editable: canWrite,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      filterParams: {
        valueFormatter: (params) => (params.value ? 'Active' : 'Inactive'),
      },
      cellEditorPopup: true,
      valueFormatter: ({ value }) => (value ? 'Active' : 'Inactive'),
      cellRenderer: ({ value }) => (
        <BBDTag theme2={value} error={!value} style={{ textAlign: 'center' }}>
          {value ? 'Active' : 'Inactive'}
        </BBDTag>
      ),
      cellEditorParams: {
        cellHeight: 25,
        options: [
          {
            value: true,
            label: 'Active',
          },
          {
            value: false,
            label: 'Disabled',
          },
        ],
        showSearch: false,
        allowClear: false,
      },
    },
    {
      field: 'CounterPartyCategoryCvId',
      headerName: 'Type',
      isBulkEditable: canWrite,
      bulkCellEditor: BulkSelectEditor,
      bulkCellEditorParams: {
        propKey: 'CounterPartyCategoryCvId',
        options: metadata?.CounterPartyCategoryList.map(toAntOption) ?? [],
      },
      editable: canWrite,
      cellEditorPopup: true,
      cellEditor: 'agRichSelectCellEditor',
      onCellValueChanged: (params) => {
        const selectedtype = params?.data?.CounterPartyCategoryCvId
        params.data.CounterPartyCategoryCvId = parseInt(
          metadata?.CounterPartyCategoryList?.find((v) => v?.Text === selectedtype)?.Value
        )
      },
      valueGetter: (props) => {
        const id = props?.data?.CounterPartyCategoryCvId
        if (typeof id === 'string') {
          return isDefinedAndNotNull(id) ? metadata?.CounterPartyCategoryList?.find((v) => v?.Text === id)?.Text : ' ' // Need a blank space to group rows without types together
        }
        return isDefinedAndNotNull(id)
          ? metadata?.CounterPartyCategoryList?.find((v) => v?.Value === id.toString())?.Text
          : ' '
      },
      cellEditorParams: {
        cellHeight: 20,
        values: metadata?.CounterPartyCategoryList?.length
          ? ['None', ...metadata?.CounterPartyCategoryList?.map((v) => v?.Text)]
          : [],
      },
    },
    {
      field: 'Name',
      headerName: 'Name',
      editable: canWrite,
      sort: 'asc',
      comparator: (valueA, valueB) => {
        return valueA?.toLowerCase().localeCompare(valueB?.toLowerCase())
      },
    },
    {
      field: 'Abbreviation',
      headerName: 'Abbr.',
      editable: canWrite,
    },
    {
      field: 'PrimaryInternalCounterpartyId',
      headerName: 'Primary Internal',
      isBulkEditable: canWrite,
      bulkCellEditor: BulkSelectEditor,
      bulkCellEditorParams: {
        propKey: 'PrimaryInternalCounterpartyId',
        options: metadata?.InternalCounterPartyList.map(toAntOption) ?? [],
      },
      editable: canWrite,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        options: metadata?.InternalCounterPartyList?.map((option) => ({
          value: option.Value,
          label: option.Text,
        })),
      },
      valueGetter: ({ data }) =>
        metadata?.InternalCounterPartyList?.find(
          (item) => item.Value === data?.PrimaryInternalCounterpartyId?.toString()
        )?.Text ?? '',
    },
    {
      field: 'CreditStatusCvId',
      headerName: 'Integrated Credit Status',
      cellRenderer: (params) => {
        const value = metadata?.CreditStatusList?.find((cat) => cat.Value == params?.data?.CreditStatusCvId)?.Text
        const hasOverrideStatus = params?.data?.CreditStatusOverrideCvId
        const shouldHighlight = !hasOverrideStatus && value
        const fallBackColor = value ? '' : ''
        const tooltipText =
          CREDIT_STATUS_INFO_MAP[value || 'No value set']?.description ||
          CREDIT_STATUS_INFO_MAP['No value set'].description

        return (
          <Texto style={{ color: shouldHighlight ? CREDIT_STATUS_COLOR[value] : fallBackColor }} weight={600}>
            <Tooltip title={tooltipText}> {value || 'No value set'} </Tooltip>
          </Texto>
        )
      },
      editable: false,
      valueGetter: (props) => {
        const id = props?.data?.CreditStatusCvId
        return isDefinedAndNotNull(id) ? metadata?.CreditStatusList?.find((v) => v.Value === id.toString())?.Text : ' ' // Need a blank space to group rows without types together
      },
    },
    {
      field: 'CreditStatusOverrideCvId',
      headerName: 'Credit Status Override',
      isBulkEditable: canWrite,
      bulkCellEditor: BulkSelectEditor,
      bulkCellEditorParams: {
        options: [{ label: 'None', value: ' ' }, ...(metadata?.CreditStatusList?.map(toAntOption) ?? [])],
        propKey: 'CreditStatusOverrideCvId',
      },
      editable: canWrite,
      cellEditorPopup: true,
      cellEditor: 'agRichSelectCellEditor',
      valueGetter: (props) => {
        const id = props?.data?.CreditStatusOverrideCvId
        return isDefinedAndNotNull(id) ? metadata?.CreditStatusList?.find((v) => v.Value === id.toString())?.Text : ' ' // Need a blank space to group rows without types together
      },
      valueSetter: (params) => {
        const newText = params.newValue
        const creditStatuses = metadata?.CreditStatusList ?? []

        if (newText === 'None' || newText === '' || newText == null) {
          params.data.CreditStatusOverrideCvId = ''
        } else {
          const match = creditStatuses.find((v) => v.Text === newText)
          params.data.CreditStatusOverrideCvId = match?.Value ?? ''
        }

        return true
      },
      cellEditorParams: {
        cellHeight: 20,
        values: metadata?.CreditStatusList?.length ? ['None', ...creditStatuses.map((v) => v.Text)] : [],
      },
      cellRenderer: (params) => {
        const value = metadata?.CreditStatusList?.find(
          (cat) => cat.Value == params?.data?.CreditStatusOverrideCvId
        )?.Text
        const tooltipText =
          CREDIT_STATUS_INFO_MAP[value || 'No value set']?.description ||
          CREDIT_STATUS_INFO_MAP['No value set'].description
        return (
          <Texto style={{ color: value ? CREDIT_STATUS_COLOR[value] : '' }} weight={600}>
            <Tooltip title={tooltipText}>{value || 'No value set'}</Tooltip>
          </Texto>
        )
      },
    },
    {
      editable: canWrite,
      field: 'HasCustomerPortal',
      headerName: 'Application Enabled',
      headerTooltip: 'Allows counterparty users to log in and enables impersonation',
      isBulkEditable: canWrite,
      bulkCellEditor: BulkSelectEditor,
      bulkCellEditorParams: {
        propKey: 'HasCustomerPortal',
        options: [
          {
            value: true,
            label: 'Approved',
          },
          {
            value: false,
            label: 'Not Approved',
          },
        ],
      },
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      filterParams: {
        valueFormatter: (params) => (params.value ? 'Approved' : 'Not Approved'),
      },
      cellEditorPopup: true,
      valueFormatter: ({ value }) => (value ? 'Yes' : 'No'),
      cellRenderer: ({ value }) => (
        <BBDTag theme2={value} error={!value} style={{ textAlign: 'center' }}>
          {value ? 'Approved' : 'Not Approved'}
        </BBDTag>
      ),
      cellEditorParams: {
        cellHeight: 25,
        options: [
          {
            value: true,
            label: 'Approved',
          },
          {
            value: false,
            label: 'Not Approved',
          },
        ],
        showSearch: false,
        allowClear: false,
      },
    },
  ] as ColDef[]
}
