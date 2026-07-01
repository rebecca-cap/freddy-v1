// Freddy mock fixture — not used in production code paths.
// PricePublishers admin reads codeSetData?.Data[1].CodeValues — needs the
// envelope shape { Data: CodeSetData[] } where each item carries CodeValues[].
// Indexed access is positional: caller passes ['PricePublisherType', 'PriceType']
// so Data[0] should be PricePublisherType and Data[1] should be PriceType.

export const codeSetFixture = {
  TotalRecords: 2,
  Data: [
    {
      CodeSetId: 1,
      CodeSetName: 'PricePublisherType',
      CodeValues: [
        {
          CodeValueId: 101,
          Display: 'Demo Wholesale',
          Meaning: 'Wholesale',
          Description: 'Fictional wholesale publisher type',
          Order: 1,
          IsActive: true,
          CodeValueRelations: {},
        },
        {
          CodeValueId: 102,
          Display: 'Demo Spot',
          Meaning: 'Spot',
          Description: 'Fictional spot market publisher type',
          Order: 2,
          IsActive: true,
          CodeValueRelations: {},
        },
      ],
    },
    {
      CodeSetId: 2,
      CodeSetName: 'PriceType',
      CodeValues: [
        {
          CodeValueId: 201,
          Display: 'Rack',
          Meaning: 'Rack',
          Description: 'Fictional rack price type',
          Order: 1,
          IsActive: true,
          CodeValueRelations: {},
        },
        {
          CodeValueId: 202,
          Display: 'Index',
          Meaning: 'Index',
          Description: 'Fictional index price type',
          Order: 2,
          IsActive: true,
          CodeValueRelations: {},
        },
      ],
    },
  ],
  Query: null,
  Validations: [],
}
