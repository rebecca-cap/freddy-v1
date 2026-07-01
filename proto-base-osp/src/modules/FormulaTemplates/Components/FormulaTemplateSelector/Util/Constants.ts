export type FormulaTemplateFilter = {
  ProductIds: string[]
  LocationIds: string[]
  PriceTypeCvIds: string[]
  CategoryIds: string[]
  Keyword: string
}
export const initialFilters = {
  ProductIds: [],
  LocationIds: [],
  PriceTypeCvIds: [],
  CategoryIds: [],
  Keyword: '',
}
