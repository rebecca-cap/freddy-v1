// Freddy mock fixture — fictional
// ProductManagement/read returns { Data: ProductOverviewData[] }.
// Metadata's Data.ProductGroups feeds ManageProductGroups (.map at line 33).

const editableSources = [
  { Text: 'Sinclair ERP', Value: '1', GroupingValue: null },
  { Text: 'Sinclair TMS', Value: '2', GroupingValue: null },
]

const productGroups = [
  { Text: 'Refined Distillates', Value: '1', GroupingValue: null },
  { Text: 'Gasoline Grades', Value: '2', GroupingValue: null },
  { Text: 'Renewables', Value: '3', GroupingValue: null },
  { Text: 'Aviation', Value: '4', GroupingValue: null },
  { Text: 'Lubricants', Value: '5', GroupingValue: null },
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
  TotalRecords: 6,
  Data: [
    makeProduct(67, '#2 ULSD - 0032', 'ULSD', 1, 1, 'Refined Distillates', 'Diesel', 'Ultra Low Sulfur'),
    makeProduct(33, '#1 ULSD - 0033', 'ULSD1', 1, 1, 'Refined Distillates', 'Diesel', 'Ultra Low Sulfur'),
    makeProduct(34, '#2 ULSD DYED - 0034', 'ULSDD', 1, 1, 'Refined Distillates', 'Diesel', 'Dyed Ultra Low Sulfur'),
    makeProduct(24, 'UNLD - 0024', 'UNLD', 1, 2, 'Gasoline Grades', 'Gasoline', 'Regular'),
    makeProduct(28, 'PRM - 0028', 'PRM', 1, 2, 'Gasoline Grades', 'Gasoline', 'Premium'),
    makeProduct(38, 'M/G10% - 0038', 'MG10', 1, 2, 'Gasoline Grades', 'Gasoline', '10% Ethanol Blend'),
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
