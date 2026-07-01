// Freddy mock fixture — fictional
// LocationManagement/read returns { Data: LocationOverviewData[] }.
// Metadata's Data.LocationGroups feeds ManageLocationGroups (.map at line 33).

const editableSources = [
  { Text: 'Sinclair ERP', Value: '1', GroupingValue: null },
  { Text: 'Sinclair TMS', Value: '2', GroupingValue: null },
]

const locationGroups = [
  { Text: 'Rocky Mountain Racks', Value: '1', GroupingValue: null },
  { Text: 'Front Range Terminals', Value: '2', GroupingValue: null },
  { Text: 'High Plains Racks', Value: '3', GroupingValue: null },
  { Text: 'Southwest Terminals', Value: '4', GroupingValue: null },
  { Text: 'Refineries', Value: '5', GroupingValue: null },
]

const locationTypes = [
  { Text: 'Terminal', Value: '1', GroupingValue: null },
  { Text: 'Refinery', Value: '2', GroupingValue: null },
  { Text: 'Rack', Value: '3', GroupingValue: null },
  { Text: 'Pipeline', Value: '4', GroupingValue: null },
]

const makeLocation = (
  id: number,
  name: string,
  abbr: string,
  typeCv: number,
  groupId: number,
  region: string,
  area: string,
  lat: number,
  lng: number
) => ({
  LocationId: id,
  Name: name,
  Abbreviation: abbr,
  LocationTypeCvId: typeCv,
  Latitude: lat,
  Longitude: lng,
  LocationGroupId: groupId,
  NetOrGross: 1,
  MarketPlatformAssociatedProducts: [67, 33, 34, 24, 28, 38],
  SourceInfo: {
    SourceSystemId: 1,
    SourceId: id,
    SourceIdString: `LOC-${id}`,
  },
  IsActive: true,
  Region: region,
  Area: area,
  LocationReportingAttributes: [],
})

export const locationsReadFixture = {
  TotalRecords: 8,
  Data: [
    // DENVER is the Arbs hero terminal but is NOT in the Midcon CSV (it's Rocky-Mountain).
    // Catalog-exempt: kept for the arb scenario, flagged via IsInCatalog: false.
    { ...makeLocation(1142, 'DENVER', 'DEN', 3, 2, 'Mountain', 'Colorado', 39.7392, -104.9903), IsInCatalog: false },
    makeLocation(1633, 'N PLATTE', 'NPL', 3, 3, 'High Plains', 'Nebraska', 41.1239, -100.7654),
    makeLocation(1634, 'OMAHA', 'OMA', 3, 3, 'High Plains', 'Nebraska', 41.2565, -95.9345),
    makeLocation(1631, 'LINCOLN MAG', 'LNK', 3, 3, 'High Plains', 'Nebraska', 40.8136, -96.7026),
    makeLocation(1632, 'NORFOLK', 'NFK', 3, 3, 'High Plains', 'Nebraska', 42.0286, -97.4170),
    makeLocation(1627, 'COLUMBUS NE', 'CLB', 3, 3, 'High Plains', 'Nebraska', 41.4297, -97.3683),
    makeLocation(1629, 'GENEVA', 'GVA', 3, 3, 'High Plains', 'Nebraska', 40.5264, -97.5959),
    makeLocation(1628, 'DONIPHAN', 'DNP', 3, 3, 'High Plains', 'Nebraska', 40.7714, -98.3676),
  ],
  Query: null,
  Validations: [],
}

export const locationsMetadataFixture = {
  Data: {
    LocationGroups: locationGroups,
    LocationGroupList: locationGroups,
    LocationTypeList: locationTypes,
    EditableSources: editableSources,
  },
  Query: null,
  Validations: [],
}
