import { ExcelStyle } from 'ag-grid-community'

export const excelStyles = [
  {
    id: 'numberType',
    numberFormat: {
      format: '0',
    },
  },
  {
    id: 'stringType',
    dataType: 'String',
  },
  {
    id: 'dateType',
    dataType: 'DateTime',
  },
] as ExcelStyle[]
