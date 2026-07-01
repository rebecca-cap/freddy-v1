import { EditOutlined } from '@ant-design/icons'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { getReportingAttributesColumns } from '@components/shared/Grid/sharedColumnDefs/ReportingAttributesColumns'
import { BBDTag, ManyTag } from '@gravitate-js/excalibrr'
import { hiddenColumn } from '@utils/grid'
import { isDefined } from '@utils/index'
import { Button } from 'antd'
import React from 'react'

export const getColumnDefs = (locationsData, metadata, initializeSourceModal, canWrite) => {
  const columns: any = []

  columns.push(
    {
      field: 'sourceInfo',
      editable: false,
      headerName: 'Source',
      sortable: false,
      colId: 'sourceInfo',
      filterValueGetter: ({ data }) => data?.SourceInfo?.SourceId || data?.SourceInfo?.SourceIdString,
      flex: 1,
      minWidth: 150,
      cellRenderer: (params) => {
        const SourceInfo = params?.data?.SourceInfo
        const SourceId = SourceInfo?.SourceId
        const SourceSystemId = SourceInfo?.SourceSystemId
        const SourceIdString = SourceInfo?.SourceIdString
        const sourceSystem = metadata?.Data?.EditableSources?.find((item) => item.Value === SourceSystemId?.toString())
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
                <Button type='link' style={{ pointerEvents: 'none', minWidth: 100, color: 'black' }}>
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
    hiddenColumn({ title: 'Region' }),
    hiddenColumn({ title: 'Area' }),
    {
      headerName: 'Location Name',
      field: 'Name',
      minWidth: 230,
      flex: 1,
      editable: canWrite,
    },
    {
      field: 'LocationTypeCvId',
      headerName: 'Type',
      editable: canWrite,
      cellEditorPopup: true,
      cellEditor: 'agRichSelectCellEditor',
      onCellValueChanged: (params) => {
        const selectedtype = params?.data?.LocationTypeCvId
        params.data.LocationTypeCvId = parseInt(
          metadata?.Data?.LocationTypes?.find((v) => v?.Text === selectedtype)?.Value
        )
      },
      valueGetter: (props) => {
        const id = props?.data?.LocationTypeCvId
        if (typeof id === 'string') {
          return isDefined(id) ? metadata?.Data?.LocationTypes?.find((v) => v?.Text === id)?.Text : ' ' // Need a blank space to group rows without types together
        }
        return isDefined(id) ? metadata?.Data?.LocationTypes?.find((v) => v?.Value === id.toString())?.Text : ' '
      },
      cellEditorParams: {
        cellHeight: 20,
        values: metadata?.Data?.LocationTypes?.length
          ? ['None', ...metadata?.Data?.LocationTypes?.map((v) => v?.Text)]
          : [],
      },
    },
    {
      headerName: 'Status',
      field: 'IsActive',
      maxWidth: 120,
      editable: canWrite,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      filterParams: {
        valueFormatter: (params) => (params.value ? 'Active' : 'Inactive'),
      },
      valueFormatter: ({ value }) => (value === true ? 'Active' : value === false ? 'Inactive' : ''),
      isBulkEditable: canWrite,
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
        showSearch: true,
      },
      cellRenderer: ({ value }) =>
        value ? (
          <BBDTag success style={{ textAlign: 'center' }}>
            Active
          </BBDTag>
        ) : (
          <BBDTag error style={{ textAlign: 'center' }}>
            Inactive
          </BBDTag>
        ),
    },
    {
      field: 'Abbreviation',
      headerName: 'Abbr.',
      flex: 1,
      editable: canWrite,
    },
    {
      headerName: 'Location Group',
      field: 'LocationGroupId',
      flex: 1,
      minWidth: 180,
      editable: canWrite,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        options: metadata?.Data?.LocationGroups?.map((option) => ({
          value: option.Value,
          label: option.Text,
        })),
      },
      valueGetter: (params) => {
        return params?.data?.LocationGroupId
          ? metadata?.Data?.LocationGroups?.find((option) => option.Value === params?.data?.LocationGroupId.toString())
              ?.Text
          : 'None'
      },
    },
    {
      headerName: 'Net or Gross',
      field: 'NetOrGross',
      flex: 1,
      minWidth: 180,
      editable: canWrite,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        options: metadata?.Data?.NetOrGross?.map((option) => ({
          value: option.Value,
          label: option.Text,
        })),
      },
      valueGetter: (params) => {
        return params?.data?.NetOrGross
          ? metadata?.Data?.NetOrGross?.find((option) => option.Value === params?.data?.NetOrGross.toString())?.Text
          : 'None'
      },
    },
    {
      headerName: 'Latitude',
      field: 'Latitude',
      width: 30,
    },
    {
      headerName: 'Longitude',
      field: 'Longitude',
      width: 30,
    },
    {
      headerName: 'Available Products',
      field: 'MarketPlatformAssociatedProducts',
      minWidth: 300,
      editable: false,
      filterValueGetter: ({ data }) => {
        return metadata?.Data?.MarketPlatformProducts?.filter((product) =>
          data.MarketPlatformAssociatedProducts.includes(parseInt(product.Value, 10))
        )?.map((item) => item.Text)
      },
      valueGetter: ({ data }) => {
        return metadata?.Data?.MarketPlatformProducts?.filter((product) =>
          data.MarketPlatformAssociatedProducts.includes(parseInt(product.Value, 10))
        ).map((item) => item.Text)
      },
      cellRenderer: (params) => {
        const { data } = params
        if (data.MarketPlatformAssociatedProducts?.length) {
          const relatedLocations = metadata?.Data?.MarketPlatformProducts.filter((product) =>
            data.MarketPlatformAssociatedProducts?.includes(parseInt(product.Value, 10))
          )
          return <ManyTag tagItems={relatedLocations?.map((item) => item.Text)} maxCount={2} />
        }
        return ''
      },
      filter: true,
    },
    ...getReportingAttributesColumns(locationsData)
  )

  return columns
}
