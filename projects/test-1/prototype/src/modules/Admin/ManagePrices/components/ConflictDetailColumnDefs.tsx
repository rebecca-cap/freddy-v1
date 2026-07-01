import { dateFormat } from '@components/TheArmory/helpers'
import moment from 'moment'

export function ConflictDetailColumnDefs(priceTypes: string[]) {
  // Static columns
  const staticColumns = [
    {
      field: 'CurvePointId',
      headerName: 'Curve Point ID',
    },
    {
      field: 'EffectiveFromDateTime',
      headerName: 'Effective From',
      valueFormatter: ({ value }: any) => (value ? moment(value).format(dateFormat.DATE_TIME) : ''),
    },
    {
      field: 'EffectiveToDateTime',
      headerName: 'Effective To',
      valueFormatter: ({ value }: any) => (value ? moment(value).format(dateFormat.DATE_TIME) : ''),
    },
  ]

  // Dynamic columns for each price type
  const priceTypeColumns = priceTypes.map((priceType) => ({
    field: priceType,
    headerName: priceType,
    valueFormatter: ({ value }: any) => (value !== null && value !== undefined ? value.toString() : ''),
  }))

  return [...staticColumns, ...priceTypeColumns]
}
