import {
  AllocationAssociationsReferencesMetadata,
  AllocationAssociationsReferencesResponseData,
} from '@modules/Admin/ManageAllocationAssociations/api/types.schema'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { ICellEditorParams, ValueSetterParams } from 'ag-grid-community'
import { Popover } from 'antd'
import React from 'react'

export const createReferenceDataMappingsColumns = (
  metadata: AllocationAssociationsReferencesMetadata | AllocationAssociationsReferencesResponseData,
  idKey: string,
  metaKey: string,
  metaId: string,
  uniqueReferenceDataValues: number[],
  canWrite: boolean
) => {
  return [
    {
      field: 'Display',
      headerName: idKey,
      editable: false,
    },
    {
      field: `Allocation${idKey}Associations`,
      headerName: metaKey,
      cellEditor: 'SearchableSelect',
      suppressKeyboardEvent,
      editable: canWrite,
      cellEditorPopup: true,
      autoHeight: true,
      cellEditorParams: (params: ICellEditorParams) => {
        const value = params?.data?.[`Allocation${idKey}Associations`]

        return {
          mode: 'multiple',
          placeholder: `Select associated ${metaKey}`,
          options: metadata?.map((option) => ({
            value: Number(option.Value),
            label: option.Text,
          })),
          value: value?.map((item) => item[metaId]),
          showSearch: true,
          allowClear: true,
          showPopConfirmOnClear: true,
          enableSelectAllFromSearch: true,
        }
      },
      filterParams: {
        values: uniqueReferenceDataValues,
        valueFormatter: (params) => metadata?.find((meta) => meta?.Value === params?.value?.toString())?.Text,
      },
      valueSetter: (params: ValueSetterParams) => {
        const selectedValues = params.newValue.map((cpId) => {
          return { [metaId]: cpId }
        })
        // eslint-disable-next-line no-param-reassign
        params.data[`Allocation${idKey}Associations`] = selectedValues
      },
      valueGetter: (params) => {
        return params.data[`Allocation${idKey}Associations`].map((association) => {
          return association[metaId]
        })
      },
      comparator: (valueA, valueB, _nodeA, _nodeB, isInverted) => {
        const dataA = valueA?.length
          ? valueA?.length > 1
            ? 'Multiple'
            : metadata?.find((meta) => meta.Value === valueA[0]?.toString())?.Text
          : ''
        const dataB = valueB?.length
          ? valueB?.length > 1
            ? 'Multiple'
            : metadata?.find((meta) => meta.Value === valueB[0]?.toString())?.Text
          : ''

        const aFormat = dataA?.toLowerCase()
        const bFormat = dataB?.toLowerCase()

        if (aFormat === '' && bFormat === '') {
          return 0
        }
        if (aFormat === '') {
          return isInverted ? -1 : 1
        }
        if (bFormat === '') {
          return isInverted ? 1 : -1
        }

        return aFormat?.localeCompare(bFormat)
      },
      cellRenderer: ({ value }) => {
        return <CellHoverPopOver list={value} metadata={metadata} title={`MULTIPLE ${metaKey?.toUpperCase()}`} />
      },
    },
  ]
}

function CellHoverPopOver({ list, title, metadata }) {
  const getTextFromId = (id) => {
    if (metadata && metadata?.length) {
      const item = metadata?.find((meta) => meta.Value === id?.toString())
      return item ? item.Text : id?.toString()
    }
    return id?.toString()
  }
  const textList = list?.map(getTextFromId).sort((a, b) => a.localeCompare(b))

  if (!list?.length) {
    return <Texto />
  }
  if (textList?.length === 1) {
    return <Texto>{textList[0]}</Texto>
  }
  return (
    <Popover
      placement='bottomLeft'
      content={
        <div
          style={{
            maxHeight: '65vh',
            overflowY: 'auto',
          }}
        >
          {textList?.map((item) => (
            <Horizontal key={item}>
              <Texto>{item}</Texto>
            </Horizontal>
          ))}
        </div>
      }
    >
      {title}
    </Popover>
  )
}
