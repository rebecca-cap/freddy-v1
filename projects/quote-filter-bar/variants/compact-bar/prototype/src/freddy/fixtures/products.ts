// Freddy mock fixture — fictional
// ProductManagement/read returns { Data: ProductOverviewData[] }.
// Metadata's Data.ProductGroups feeds ManageProductGroups (.map at line 33).

const editableSources = [
  { Text: 'Demo ERP', Value: '1', GroupingValue: null },
  { Text: 'Demo TMS', Value: '2', GroupingValue: null },
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
  TotalRecords: 12,
  Data: [
    makeProduct(7001, 'ULSD', 'ULSD', 1, 1, 'Refined Distillates', 'Diesel', 'Ultra Low Sulfur'),
    makeProduct(7002, 'Gasoline 87', 'G87', 1, 2, 'Gasoline Grades', 'Gasoline', 'Regular'),
    makeProduct(7003, 'Gasoline 89', 'G89', 1, 2, 'Gasoline Grades', 'Gasoline', 'Mid-Grade'),
    makeProduct(7004, 'Gasoline 91', 'G91', 1, 2, 'Gasoline Grades', 'Gasoline', 'Premium'),
    makeProduct(7005, 'Jet A', 'JETA', 1, 4, 'Aviation', 'Jet Fuel', 'Commercial'),
    makeProduct(7006, 'Biodiesel B5', 'B5', 3, 3, 'Renewables', 'Biodiesel', 'B5 Blend'),
    makeProduct(7007, 'Biodiesel B20', 'B20', 3, 3, 'Renewables', 'Biodiesel', 'B20 Blend'),
    makeProduct(7008, 'Renewable Diesel', 'RD', 3, 3, 'Renewables', 'Renewable Diesel', 'R99'),
    makeProduct(7009, 'Heating Oil', 'HO', 1, 1, 'Refined Distillates', 'Heating Oil', 'No. 2'),
    makeProduct(7010, 'Kerosene', 'KERO', 1, 1, 'Refined Distillates', 'Kerosene', 'K-1'),
    makeProduct(7011, 'Ethanol E10', 'E10', 3, 3, 'Renewables', 'Ethanol', 'E10 Blend'),
    makeProduct(7012, 'Aviation Gas 100LL', 'AG100', 1, 4, 'Aviation', 'AvGas', '100LL'),
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

// ReferenceData/Hierarchy/Product/List → HierarchyListItem[] (bare array).
// CommandCenterPage reads [0].Key to seed ProductHierarchyTypeCvId, so this
// must be non-empty. Shape: { Key, Name, Levels } per Hierarchies/types.ts.
export const productHierarchyListFixture: Array<{
  Key: number
  Name: string
  Levels: string[]
}> = [
  { Key: 1, Name: 'Product Family Hierarchy', Levels: ['Family', 'Group', 'Product'] },
  { Key: 2, Name: 'Commodity Hierarchy', Levels: ['Commodity', 'Grade', 'Product'] },
]
