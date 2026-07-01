export interface AvailabilityMaintenanceRow {
  AvailableVolumeName: string
  AvailableVolumeId: number
  Product: string
  ProductId: number
  Location: string
  LocationId: number
  GridCells: GridCell[]
  RowHasAvailableLessThanMinimum: boolean
  AssociatedSetups: number[]
  AssociatedProducts: number[]
  AssociatedLocations: number[]
}

export interface GridCell {
  AvailableVolumeId: number
  SupplierId: number | null
  PeriodId: number | null
  PeriodName: string
  CellFullName: string | null
  AvailableQuantity: number
  IsChanged: boolean
  PeriodFullDate: string | null
}

export interface GridResponse {
  Rows: AvailabilityMaintenanceRow[]
  MaxPromptUpdateFromAllocationDateTime: string | Date
}
