// Freddy mock fixture — fictional
// ProductManagement/read returns { Data: ProductOverviewData[] }.
// Metadata's Data.ProductGroups feeds ManageProductGroups (.map at line 33).

const editableSources = [
  { Text: 'Cost ERP', Value: '1', GroupingValue: null },
  { Text: 'Cost TMS', Value: '2', GroupingValue: null },
]

const productGroups = [
  { Text: 'Refined Distillates', Value: '1', GroupingValue: null },
  { Text: 'Gasoline Grades', Value: '2', GroupingValue: null },
]

const productTypes = [
  { Text: 'Refined', Value: '1', GroupingValue: null },
  { Text: 'Crude', Value: '2', GroupingValue: null },
  { Text: 'Renewable', Value: '3', GroupingValue: null },
]

const makeProduct = (
  id: number,
  name: string,
  abbr: string,
  typeCv: number,
  groupId: number,
  group: string,
  commodity: string,
  grade: string
) => ({
  ProductId: id,
  Name: name,
  Abbreviation: abbr,
  ProductTypeCvId: typeCv,
  ProductGroupId: groupId,
  AllowWeightedDistribution: true,
  NotSoldSeparately: false,
  IsTradingProduct: true,
  MarketPlatformAdditionalProducts: [],
  SourceInfo: {
    SourceSystemId: 1,
    SourceId: id,
    SourceIdString: `PROD-${id}`,
  },
  IsActive: true,
  Commodity: commodity,
  ProductGroup: group,
  Grade: grade,
  ProductReportingAttributes: [],
})

export const productsReadFixture = {
  TotalRecords: 4,
  Data: [
    makeProduct(189877, '189877 - #2 ULS CL', '2ULSCL', 1, 1, 'Refined Distillates', 'Diesel', 'Ultra Low Sulfur Clear'),
    makeProduct(189878, '189878 - #2 ULS DYED', '2ULSDY', 1, 1, 'Refined Distillates', 'Diesel', 'Ultra Low Sulfur Dyed'),
    makeProduct(189901, '189901 - UNL 87', 'UNL87', 1, 2, 'Gasoline Grades', 'Gasoline', 'Regular Unleaded'),
    makeProduct(189903, '189903 - PREM UNL', 'PREMUNL', 1, 2, 'Gasoline Grades', 'Gasoline', 'Premium Unleaded'),
  ],
  Query: null,
  Validations: [],
}

export const productsMetadataFixture = {
  Data: {
    ProductGroups: productGroups,
    ProductGroupList: productGroups,
    ProductTypeList: productTypes,
    EditableSources: editableSources,
  },
  Query: null,
  Validations: [],
}
