import { ExcelExportParams, GridApi } from 'ag-grid-community'
import { RefObject } from 'react'

export const onExport = (
  gridAPIRef: RefObject<GridApi>,
  excelParams: ExcelExportParams | undefined
) => {
  gridAPIRef?.current?.exportDataAsExcel(excelParams)
}
