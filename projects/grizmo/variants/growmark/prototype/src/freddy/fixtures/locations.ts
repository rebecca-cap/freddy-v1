// Freddy mock fixture — fictional
// LocationManagement/read returns { Data: LocationOverviewData[] }.
// Metadata's Data.LocationGroups feeds ManageLocationGroups (.map at line 33).

const editableSources = [
  { Text: 'Cost ERP', Value: '1', GroupingValue: null },
  { Text: 'Cost TMS', Value: '2', GroupingValue: null },
]

const locationGroups = [
  { Text: 'Magellan Pipeline (MPL)', Value: '1', GroupingValue: null },
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
  MarketPlatformAssociatedProducts: [7001, 7002, 7003],
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
  TotalRecords: 5,
  Data: [
    makeLocation(1207, '1207 - NORTH LITTLE ROCK, AR - MPL- N', 'NLR', 1, 1, 'South Central', 'Arkansas', 34.7695, -92.2671),
    makeLocation(1208, '1208 - LITTLE ROCK, AR - MPL- S', 'LRK', 1, 1, 'South Central', 'Arkansas', 34.7465, -92.2896),
    makeLocation(1211, '1211 - FORT SMITH, AR - MPL- W', 'FSM', 1, 1, 'South Central', 'Arkansas', 35.3859, -94.3985),
    makeLocation(1215, '1215 - MEMPHIS, TN - MPL- E', 'MEM', 1, 1, 'South Central', 'Tennessee', 35.1495, -90.0490),
    makeLocation(1219, '1219 - TULSA, OK - MPL- N', 'TUL', 1, 1, 'South Central', 'Oklahoma', 36.1539, -95.9928),
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
