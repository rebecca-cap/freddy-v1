import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { Button } from 'antd'

export const getFormulaManagementColumnDefs = ({ setManagedFormula }) => {
  const columnDefs = [
    {
      field: 'Name',
      headerName: 'Name',
    },
    {
      field: 'Tag',
      headerName: 'Tag',
      valueGetter: () => 'N/A',
    },
    {
      headerName: 'Variable Count',
      valueGetter: (params) => params?.data.FormulaVariables?.length,
    },
    {
      field: 'Formula',
      headerName: 'Formula',
      cellRenderer: ({ value }) => (
        <Texto
          className='px-4 py-2'
          style={{
            backgroundColor: 'var(--gray-200)',
            fontWeight: 'bolder',
            fontFamily: 'monospace',
            color: 'var(--dark-gray)',
            borderRadius: '0.2rem',
          }}
        >
          {value}
        </Texto>
      ),
    },
    {
      cellRenderer: (params) => (
        <Horizontal style={{ gap: '1rem' }}>
          <Button size='small' type='link' onClick={() => setManagedFormula(params.data.FormulaId)}>
            Manage
          </Button>
          <Button size='small' type='text'>
            Duplicate
          </Button>
        </Horizontal>
      ),
    },
  ]
  return columnDefs
}
