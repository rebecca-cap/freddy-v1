import { DeleteOutlined, LinkOutlined, LockOutlined, WarningOutlined } from '@ant-design/icons'
import { BBDTag, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { QuoteMappingMetadata } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Api/types.schema'
import { UseMutationResult } from '@tanstack/react-query'
import { isDefinedAndNotNull } from '@utils/index'
import { ColDef } from 'ag-grid-community'
import { Button, Popconfirm } from 'antd'
import React from 'react'

type QuoteSpreadRemovalPayload = {
  QCMappingIdsToRemove: number[]
}

type MutateFn = UseMutationResult<unknown, unknown, QuoteSpreadRemovalPayload>

type Props = {
  metadata?: QuoteMappingMetadata
  anchorIds: Set<number>
  removeSpreadMutation: MutateFn
  canWrite: boolean
}

export const isAnchorRow = (anchorIds, params) => anchorIds.has(params?.data?.QuoteConfigurationMappingId)
export const isSpreadRow = (params) => isDefinedAndNotNull(params?.data?.SpreadParentMappingId)

function SpreadTagRenderer(params) {
  if (!isSpreadRow(params)) return null
  return (
    <div>
      <BBDTag icon={<LockOutlined />}>{params?.value}</BBDTag>
    </div>
  )
}

export const getColumnDefs = ({ anchorIds, removeSpreadMutation, canWrite }: Props) => {
  return [
    {
      pinned: 'left',
      lockPosition: 'left',
      headerCheckboxSelection: canWrite,
      checkboxSelection: canWrite,
      maxWidth: 50,
    },
    {
      headerName: 'Spread Row',
      marryChildren: true,
      children: [QuoteConfigId(), ContractId(), Terminal(anchorIds), Product(), QuoteConfigType()],
    },
    {
      headerName: 'Anchor Row',
      marryChildren: true,
      children: [
        AnchorQuoteConfigId(),
        AnchorContractId(),
        AnchorTerminal(),
        AnchorProduct(),
        AnchorQuoteConfigType(),
        SpreadDiff(anchorIds),
      ],
    },
    {
      editable: false,
      filter: false,
      headerName: 'Actions',
      cellRenderer: ({ data }) => {
        if (!isDefinedAndNotNull(data?.SpreadParentMappingId))
          return <Horizontal gap='1rem' style={{ justifyContent: 'flex-end' }} />

        return (
          <Horizontal gap='1rem' style={{ justifyContent: 'center' }}>
            <Popconfirm
              title='Remove spread'
              onConfirm={() =>
                removeSpreadMutation.mutate({ QCMappingIdsToRemove: [data.QuoteConfigurationMappingId] })
              }
              okText='Yes'
              cancelText='No'
            >
              <Button icon={<DeleteOutlined />} danger size='small' />
            </Popconfirm>
          </Horizontal>
        )
      },
    },
  ] as ColDef[]
}

function QuoteConfigId() {
  return {
    headerName: 'Quote Config Id',
    field: 'QuoteConfigurationId',
    editable: false,
    initialHide: true,
  }
}
function ContractId() {
  return {
    headerName: 'Contract Id',
    field: 'CostSourceTradeEntryId',
    editable: false,
    initialHide: true,
  }
}
function Terminal(anchorIds: Set<number>) {
  return {
    editable: false,
    rowGroup: true,
    rowGroupIndex: 0,
    field: 'LocationName',
    headerName: 'Terminal',
    cellRenderer: (params) => {
      if (isAnchorRow(anchorIds, params))
        return (
          <Texto>
            <LinkOutlined className='mr-2' style={{ fontSize: 16 }} /> {params?.data?.LocationName}
          </Texto>
        )
      return params?.data?.LocationName
    },
  }
}
function Product() {
  return {
    editable: false,
    field: 'ProductName',
    headerName: 'Product',
  }
}
function QuoteConfigType() {
  return {
    editable: false,
    rowGroup: true,
    rowGroupIndex: 1,
    field: 'QuoteConfigurationName',
    headerName: 'Quote Config Type',
  }
}

function AnchorQuoteConfigId() {
  return {
    headerName: 'Anchor Quote Config Id',
    field: 'SpreadQuoteConfigurationId',
    editable: false,
    initialHide: true,
  }
}
function AnchorContractId() {
  return {
    headerName: 'Anchor Contract Id',
    field: 'SpreadTradeEntryId',
    editable: false,
    initialHide: true,
  }
}
function AnchorQuoteConfigType() {
  return {
    editable: false,
    field: 'SpreadConfig',
    headerName: 'Quote Config Type',
    cellRenderer: SpreadTagRenderer,
  }
}
function AnchorTerminal() {
  return {
    editable: false,
    field: 'SpreadLocationName',
    headerName: 'Anchor Terminal',
    cellRenderer: SpreadTagRenderer,
  }
}
function AnchorProduct() {
  return {
    editable: false,
    field: 'SpreadProductName',
    headerName: 'Anchor Product',
    cellRenderer: SpreadTagRenderer,
  }
}
function SpreadDiff(anchorIds: Set<number>) {
  return {
    editable: (params) => isDefinedAndNotNull(params?.data?.SpreadParentMappingId),
    field: 'SpreadAmount',
    headerName: 'Spread Diff',
    valueSetter: (params) => {
      const num = Number(params?.newValue)
      if (Number.isNaN(num)) return false
      params.data.SpreadAmount = num
      return true
    },
    cellRenderer: (params) => {
      if (isAnchorRow(anchorIds, params)) return null
      if (!isSpreadRow(params)) return null

      if (params?.value === 0) {
        return (
          <div>
            <BBDTag warning icon={<WarningOutlined />}>
              NO DIFF
            </BBDTag>
          </div>
        )
      }

      return fmt.decimal(params?.value)
    },
  }
}
