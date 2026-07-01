export type FormulaTemplateFilter = {
  ProductIds: string[]
  LocationIds: string[]
  PriceTypeCvIds: string[]
  Keyword: string
}
export const initialFilters = {
  ProductIds: [],
  LocationIds: [],
  PriceTypeCvIds: [],
  Keyword: '',
}
