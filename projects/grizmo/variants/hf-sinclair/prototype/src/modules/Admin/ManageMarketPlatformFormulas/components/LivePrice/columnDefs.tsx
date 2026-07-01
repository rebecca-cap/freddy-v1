import { MarketPlatformFormulaMetadata } from '@api/useMarketPlatformFormulas/types'
import { stopCloseOnEnter } from '@components/shared/Grid/cellEditors'
import { SearchableSelect } from '@components/shared/Grid/cellEditors/SelectCellEditor'

interface IProps {
  needsValueColumn: boolean
  selectedFormulaValue: any
  metadata?: MarketPlatformFormulaMetadata | undefined
}

export const getLivePriceColumnDefs = ({ metadata, needsValueColumn, selectedFormulaValue }: IProps) => {
  const columns = [
    {
      field: 'VariableName',
      headerName: 'Name',
      maxWidth: 200,
      suppressMenu: true,
      sortable: false,
    },
    {
      field: 'PriceInstrumentId',
      headerName: 'Source',
      flex: 1,
      suppressMenu: true,
      sortable: false,
      cellEditor: SearchableSelect,
      cellEditorPopup: true,
      cellEditorParams: (params) => {
        return {
          showSearch: true,
          onKeyDown: stopCloseOnEnter(params),
          options: metadata?.LiveInstruments.map((option) => ({
            value: option.Value,
            label: option.Text,
          })),
        }
      },
      cellStyle: (params) => {
        const priceInstrumentDisplay = metadata?.LiveInstruments?.find(
          (option) => option.Value == params?.data?.PriceInstrumentId
        )?.Text
        return priceInstrumentDisplay ? {} : { color: 'var(--theme-warning)', fontWeight: 'bold' }
      },
      valueFormatter: (params) => {
        const priceInstrumentDisplay = metadata?.LiveInstruments?.find(
          (option) => option.Value == params?.data?.PriceInstrumentId
        )?.Text
        return priceInstrumentDisplay || 'Source is Required'
      },
      valueGetter: (props) => {
        return metadata?.LiveInstruments?.find((option) => option.Value == props?.data?.PriceInstrumentId)?.Text
      },
    },
  ]

  if (needsValueColumn) {
    const valueColumnDef = {
      field: 'Value',
      headerName: 'Value',
      maxWidth: 100,
      editable: false,
      cellRenderer: ({ data }) => {
        const value = selectedFormulaValue?.Variables?.find(
          (v) => v.VariableName?.toLowerCase() === data?.VariableName?.toLowerCase()
        )?.Value
        return typeof value === 'number' ? fmt.currency(value) : value
      },
      cellStyle: ({ value, data }) => {
        const priceStatus = selectedFormulaValue?.Variables?.find(
          (v) => v.VariableName?.toLowerCase() === data?.VariableName?.toLowerCase()
        )?.PriceStatus

        const status = data?.Value === 'Not Required' ? 'Not Required' : priceStatus
        switch (status) {
          case 'Estimate':
            return { backgroundColor: '#D2DCF9', textAlign: 'right' }
          case 'Old':
            return { backgroundColor: 'var(--theme-warning-dim)', textAlign: 'right' }
          case 'Estimated':
            return { backgroundColor: '#D2DCF9', textAlign: 'right' }
          case 'Missing':
            return { backgroundColor: 'var(--theme-error-dim)', textAlign: 'right' }
          case 'Not Required':
          case null:
          case undefined:
            return { textAlign: 'right' }
          default:
            return { backgroundColor: 'var(--theme-success-dim)', textAlign: 'right' }
        }
      },
    }
    columns.push(valueColumnDef)
  }

  return columns
}
