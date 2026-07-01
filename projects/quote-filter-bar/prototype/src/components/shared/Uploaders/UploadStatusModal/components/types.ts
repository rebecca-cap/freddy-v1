import { Validation } from '@api/globalTypes'

export interface UploadResponseData {
  TotalRecords: number
  Data: any[]
  Query: string
  Validations: Validation[]
}
