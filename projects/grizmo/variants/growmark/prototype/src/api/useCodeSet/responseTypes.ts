export interface CodeSetResponse {
  TotalRecords: number
  Data: CodeSetData[]
  Query: null
  Validations: any[]
}

export interface CodeSetData {
  CodeSetId: number
  CodeSetName: string
  CodeValues: CodeValue[]
}

export interface CodeValue {
  CodeValueId: number
  Display: string
  Meaning: string
  Description: string
  Order: number
  IsActive: boolean
  CodeValueRelations: CodeValueRelations
}

interface CodeValueRelations {}
