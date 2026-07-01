import { ByChannelGridRow } from '@modules/Analytics/PricePerformance/ByChannel/api/types'
import { ByContractGridRow } from '@modules/Analytics/PricePerformance/ByContract/api/types'
import { ICellRendererParams, ValueGetterParams } from 'ag-grid-community'
import { Moment } from 'moment'

export type RowGetter = { (params: ValueGetterParams | ICellRendererParams): ByContractGridRow | ByChannelGridRow }

export interface Metrics {
  Liftings: number
  Profit: number
  AverageMargin: number
}
export type PayloadDate = Date | Moment
