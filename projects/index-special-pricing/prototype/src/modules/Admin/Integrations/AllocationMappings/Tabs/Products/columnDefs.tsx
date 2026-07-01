import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { ManyTag } from '@gravitate-js/excalibrr'
import React from 'react'

export const allocationProductsColumnDefs = ({ metadata, canWrite }) => [
  {
    editable: false,
    field: 'SourceValue',
  },
  {
    editable: false,
    field: 'SourceDisplay',
    headerName: 'Display',
  },
  {
    field: 'ProductIds',
    headerName: 'Products',
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    editable: canWrite,
    filter: true,
    minWidth: 500,
    cellEditorPopup: true,
    flex: 2,
    autoHeight: true,
    cellEditorParams: {
      showSearch: true,
      allowClear: true,
      closeOnBlur: true,
      mode: 'tags',
      options: metadata?.Products.map((option) => ({
        value: option.Value,
        label: option.Text,
      })),
    },
    cellRenderer: ({ value }) => {
      const tagItems = value?.map((id) => {
        return metadata?.Products.find((p) => p.Value === id)?.Text
      })
      return <ManyTag tagItems={tagItems} maxCount={5} />
    },
  },
]
