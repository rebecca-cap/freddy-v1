// Freddy mock fixture — fictional
// LocationManagement/read returns { Data: LocationOverviewData[] }.
// Metadata's Data.LocationGroups feeds ManageLocationGroups (.map at line 33).

const editableSources = [
  { Text: 'Demo ERP', Value: '1', GroupingValue: null },
  { Text: 'Demo TMS', Value: '2', GroupingValue: null },
]

const locationGroups = [
  { Text: 'Gulf Coast Terminals', Value: '1', GroupingValue: null },
  { Text: 'West Coast Terminals', Value: '2', GroupingValue: null },
  { Text: 'Mountain West Racks', Value: '3', GroupingValue: null },
  { Text: 'Midwest Hubs', Value: '4', GroupingValue: null },
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
  TotalRecords: 12,
  Data: [
    makeLocation(5001, 'Houston Terminal', 'HOU', 1, 1, 'Gulf', 'Texas', 29.7604, -95.3698),
    makeLocation(5002, 'Dallas Hub', 'DAL', 1, 4, 'Midwest', 'Texas', 32.7767, -96.7970),
    makeLocation(5003, 'Salt Lake Rack', 'SLC', 3, 3, 'Mountain', 'Utah', 40.7608, -111.8910),
    makeLocation(5004, 'Phoenix Terminal', 'PHX', 1, 2, 'West', 'Arizona', 33.4484, -112.0740),
    makeLocation(5005, 'Denver Rack', 'DEN', 3, 3, 'Mountain', 'Colorado', 39.7392, -104.9903),
    makeLocation(5006, 'Pasadena Refinery', 'PAS', 2, 5, 'Gulf', 'Texas', 29.6911, -95.2091),
    makeLocation(5007, 'Long Beach Terminal', 'LBC', 1, 2, 'West', 'California', 33.7701, -118.1937),
    makeLocation(5008, 'Chicago Hub', 'CHI', 1, 4, 'Midwest', 'Illinois', 41.8781, -87.6298),
    makeLocation(5009, 'Atlanta Rack', 'ATL', 3, 1, 'Southeast', 'Georgia', 33.7490, -84.3880),
    makeLocation(5010, 'Albuquerque Terminal', 'ABQ', 1, 3, 'Mountain', 'New Mexico', 35.0844, -106.6504),
    makeLocation(5011, 'Tulsa Refinery', 'TUL', 2, 5, 'Midwest', 'Oklahoma', 36.1539, -95.9928),
    makeLocation(5012, 'Portland Terminal', 'PDX', 1, 2, 'West', 'Oregon', 45.5152, -122.6784),
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

// ReferenceData/Hierarchy/Location/List → HierarchyListItem[] (bare array).
// CommandCenterPage reads [0].Key to seed LocationHierarchyTypeCvId, so this
// must be non-empty. Shape: { Key, Name, Levels } per Hierarchies/types.ts.
export const locationHierarchyListFixture: Array<{
  Key: number
  Name: string
  Levels: string[]
}> = [
  { Key: 1, Name: 'Geographic Hierarchy', Levels: ['Region', 'Area', 'Location'] },
  { Key: 2, Name: 'Terminal Network Hierarchy', Levels: ['Network', 'Terminal'] },
]
