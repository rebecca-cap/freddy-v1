import { CodeSetResponse } from '@api/usePricePublishers/responseTypes'
import { suppressKeyboardEvent } from '@components/shared/Grid/cellEditors'
import { BBDTag, ManyTag } from '@gravitate-js/excalibrr'
import { isDefined } from '@utils'
import React from 'react'

type CodeSet = CodeSetResponse['Data'][number]

interface ColumnDefProps {
  publisherTypes: CodeSet
  priceTypes: CodeSet
}

export const getColumnDefs = ({ publisherTypes, priceTypes }: ColumnDefProps) => [
  {
    field: 'Name',
    flex: 1,
  },
  {
    field: 'Abbreviation',
    flex: 1,
  },
  {
    field: 'PricePublisherTypeCvId',
    headerName: 'Publisher Type',
    flex: 1,
    cellEditor: 'agRichSelectCellEditor',
    onCellValueChanged: (params) => {
      const selectedPublisher = params.data.PricePublisherTypeCvId // Won't actually be the id yet, but will be the 'text' option selected in the dropdown.

      // Map the text selected back to the original id before sending to the server
      params.data.PricePublisherTypeCvId = publisherTypes.CodeValues?.find(
        (v) => v.Display === selectedPublisher
      )?.CodeValueId
    },
    cellEditorPopup: true,
    cellEditorParams: {
      cellHeight: 20,
      values: publisherTypes?.CodeValues?.length
        ? ['None', ...publisherTypes?.CodeValues.map((v) => v.Display).sort()]
        : [],
    },
    valueGetter: (props) => {
      const id = props?.data?.PricePublisherTypeCvId
      return isDefined(id) ? publisherTypes?.CodeValues?.find((v) => v.CodeValueId === id)?.Display : 'None' // Need a blank space to group rows without publishers together
    },
  },
  {
    field: 'PriceTypes',
    headerName: 'Price Types',
    enableRowGroup: false,
    flex: 1,
    cellRenderer: (props) => (
      <ManyTag
        tagItems={props?.value
          ?.map((v) => priceTypes?.CodeValues?.find((cv) => cv?.CodeValueId === v?.PriceTypeCvId)?.Display)
          .sort()}
        maxCount={5}
      />
    ),
    filter: true,
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    cellEditorPopup: true,
    filterParams: {
      valueGetter: (params) => {
        return params.data.PriceTypes.map(
          (option) => priceTypes?.CodeValues?.find((cv) => cv?.CodeValueId === option?.PriceTypeCvId)?.Display
        )
      },
    },
    cellEditorParams: (params) => {
      const value = params?.data?.PriceTypes
      return {
        options: priceTypes?.CodeValues?.map((option) => ({
          value: option.CodeValueId,
          label: option.Display,
        })),
        placeholder: 'Select Price Types',
        mode: 'multiple',
        value: value?.map((item) => item.PriceTypeCvId),
      }
    },
  },
  {
    field: 'IsActive',
    cellEditor: 'SearchableSelect',
    suppressKeyboardEvent,
    cellEditorPopup: true,
    maxWidth: 200,
    filterParams: {
      valueFormatter: (params) => (params.value ? "Active" : "Disabled"),
    },
    valueFormatter: ({ value }) => (value ? 'Active' : 'Disabled'),
    cellRenderer: ({ value }) => (
      <BBDTag success={value} error={!value} style={{ textAlign: 'center' }}>
        {!value ? 'Disabled' : 'Active'}
      </BBDTag>
    ),
    cellEditorParams: {
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
]
