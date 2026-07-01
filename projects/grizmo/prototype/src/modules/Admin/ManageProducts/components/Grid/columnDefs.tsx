import { EditOutlined } from '@ant-design/icons'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { getReportingAttributesColumns } from '@components/shared/Grid/sharedColumnDefs/ReportingAttributesColumns'
import { BBDTag, ManyTag } from '@gravitate-js/excalibrr'
import { hiddenColumn } from '@utils/grid'
import { Button } from 'antd'
import React from 'react'

export const getColumnDefs = (metadata, initializeSourceModal, productData, canWrite) => {
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
      width: 140,
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
    hiddenColumn({ title: 'Commodity' }),
    hiddenColumn({ title: 'Grade' }),
    {
      headerName: 'Product Name',
      field: 'Name',
      flex: 1,
      editable: canWrite,
    },
    {
      headerName: 'Status',
      field: 'IsActive',
      maxWidth: 120,
      editable: canWrite,
      isBulkEditable: canWrite,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      filterParams: {
        valueFormatter: (params) => (params.value ? 'Active' : 'Inactive'),
      },
      valueFormatter: ({ value }) => (value === true ? 'Active' : value === false ? 'Inactive' : ''),
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
        allowClear: false,
      },
      flex: 1,
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
      headerName: 'Product Group',
      field: 'ProductGroupId',
      flex: 1,
      editable: canWrite,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      cellEditorParams: {
        options: metadata?.Data?.ProductGroups?.map((option) => ({
          value: option.Value,
          label: option.Text,
        })),
      },
      valueGetter: (params) => {
        return params?.data?.ProductGroupId
          ? metadata?.Data?.ProductGroups?.find((option) => option.Value === params?.data?.ProductGroupId.toString())
              ?.Text
          : 'None'
      },
    },
    {
      headerName: 'Is Heating?',
      field: 'AllowWeightedDistribution',
      editable: canWrite,
      isBulkEditable: canWrite,
      maxWidth: 120,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      filterParams: {
        valueFormatter: (params) => (params.value ? 'Yes' : 'No'),
      },
      valueFormatter: ({ value }) => (value === true ? 'Active' : value === false ? 'Inactive' : ''),
      cellEditorParams: {
        options: [
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
        ],
        showSearch: false,
        allowClear: false,
      },
      cellRenderer: ({ value }) =>
        value ? (
          <BBDTag success style={{ textAlign: 'center', width: 80 }}>
            Yes
          </BBDTag>
        ) : (
          <BBDTag error style={{ textAlign: 'center', width: 80 }}>
            No
          </BBDTag>
        ),
    },
    {
      headerName: 'Trading?',
      field: 'IsTradingProduct',
      editable: canWrite,
      isBulkEditable: canWrite,
      maxWidth: 120,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      filterParams: {
        valueFormatter: (params) => (params.value ? 'Yes' : 'No'),
      },
      cellEditorParams: {
        options: [
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
        ],
        showSearch: false,
        allowClear: false,
      },
      cellRenderer: ({ value }) =>
        value ? (
          <BBDTag success style={{ textAlign: 'center', width: 80 }}>
            Yes
          </BBDTag>
        ) : (
          <BBDTag error style={{ textAlign: 'center', width: 80 }}>
            No
          </BBDTag>
        ),
    },
    {
      headerName: 'Only Additional?',
      field: 'NotSoldSeparately',
      editable: canWrite,
      isBulkEditable: canWrite,
      minWidth: 150,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      filterParams: {
        valueFormatter: (params) => (params.value ? 'Yes' : 'No'),
      },
      cellEditorParams: {
        options: [
          {
            value: true,
            label: 'Yes',
          },
          {
            value: false,
            label: 'No',
          },
        ],
        showSearch: false,
        allowClear: false,
      },
      cellRenderer: ({ value }) =>
        value ? (
          <BBDTag success style={{ textAlign: 'center', width: 80 }}>
            Yes
          </BBDTag>
        ) : (
          <BBDTag error style={{ textAlign: 'center', width: 80 }}>
            No
          </BBDTag>
        ),
    },
    {
      headerName: 'Related Products',
      field: 'MarketPlatformAdditionalProducts',
      editable: false,
      filterValueGetter: ({ data }) => {
        return productData
          ?.filter((product) => data.MarketPlatformAdditionalProducts?.includes(product.ProductId))
          .map((product) => product.Name)
      },
      valueGetter: ({ data }) => {
        return productData
          ?.filter((product) => data.MarketPlatformAdditionalProducts?.includes(parseInt(product.ProductId, 10)))
          .map((item) => item.Name)
      },
      cellRenderer: (params) => {
        const { data } = params

        if (data.MarketPlatformAdditionalProducts?.length) {
          const relatedProducts = productData?.filter((product) =>
            data.MarketPlatformAdditionalProducts?.includes(parseInt(product.ProductId, 10))
          )
          return <ManyTag tagItems={relatedProducts?.map((item) => item.Name)} maxCount={2} />
        }
        return ''
      },
      filter: true,
    },
    ...getReportingAttributesColumns(productData)
  )

  return columns
}
