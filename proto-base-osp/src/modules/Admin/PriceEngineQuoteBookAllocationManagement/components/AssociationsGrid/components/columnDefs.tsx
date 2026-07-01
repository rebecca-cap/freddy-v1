import { CloseOutlined } from '@ant-design/icons'
import { BBDTag, GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import { ColDef } from 'ag-grid-community'
import React from 'react'

export function getColumnDefs({ isDeleteMode, deleteList, addToOrRemoveFromDeleteList }) {
  return [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: '',
      maxWidth: 50,
      headerCheckboxSelectionFilteredOnly: true,
    },
    {
      headerName: 'Quote Configuration Name',
      field: 'QuoteConfigurationName',
    },

    {
      headerName: 'CounterParty',
      field: 'CounterParty',
    },
    {
      headerName: 'Product',
      field: 'Product',
    },
    {
      headerName: 'Location',
      field: 'Location',
    },
    {
      headerName: 'Linked Allocation Ids',
      field: 'LinkedAllocationIds',
      filterValueGetter: (params) => {
        return params.data.LinkedAllocationIds.map((val) => val.AllocationId)
      },
      cellRenderer: (params) => {
        if (params.data.LinkedAllocationIds.length > 0) {
          if (isDeleteMode) {
            return (
              <Horizontal>
                {params.data.LinkedAllocationIds.map((val) => {
                  const isSelected = deleteList.includes(val.AssociationId)

                  return (
                    <GraviButton
                      key={val.AllocationId}
                      className='mr-1'
                      style={{
                        width: 'fit-content',
                        backgroundColor: isSelected ? 'var(--theme-error-dim)' : '',
                      }}
                      buttonText={
                        <Horizontal verticalCenter>
                          <Texto>{val.AllocationId}</Texto>
                          <CloseOutlined className='ml-1' />
                        </Horizontal>
                      }
                      onClick={() => addToOrRemoveFromDeleteList(val.AssociationId)}
                    />
                  )
                })}
              </Horizontal>
            )
          }
          return (
            <Horizontal>
              {params.data.LinkedAllocationIds.map((val) => {
                return (
                  <BBDTag key={val.AllocationId} style={{ width: 'fit-content' }}>
                    {val.AllocationId}
                  </BBDTag>
                )
              })}
            </Horizontal>
          )
        }
        return ''
      },
    },
  ] as ColDef[]
}
