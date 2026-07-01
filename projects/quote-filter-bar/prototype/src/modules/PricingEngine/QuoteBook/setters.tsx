export function setFilterModel(api, filterModel) {
  if (!api) return
  console.log('Setting filter model for EndOfDay grid', { api, filterModel })
  api?.setFilterModel(filterModel)
}
