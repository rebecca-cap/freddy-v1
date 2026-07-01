import { BBDTag } from '@gravitate-js/excalibrr'

export function StatusColumn() {
  return {
    headerName: 'Status',
    field: 'Status',
    cellRenderer: ({ value }) => {
      return (
        <BBDTag
          style={{ width: 'fit-content' }}
          warning={value === 'At Risk'}
          error={value === 'Critical'}
          success={value === 'On Track'}
        >
          {value}
        </BBDTag>
      )
    },
  }
}
