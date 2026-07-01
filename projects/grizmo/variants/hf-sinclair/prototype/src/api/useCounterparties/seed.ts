import { CounterPartyMetadataResponse, CounterPartyOverviewResponse } from './types'

export const overviewResponse: CounterPartyOverviewResponse = {
  TotalRecords: 1,
  Data: [
    {
      CounterPartyId: 2955,
      Name: 'ABC Energy Inc.',
      Abbreviation: 'ABC Energy Inc.',
      HasCustomerPortal: false,
      CounterpartyCategoryCvId: 501,
      PrimaryInternalCounterpartyId: 1,
      CreditStatusOverrideCvId: null,
      IsActive: true,
      SourceInfo: {
        SourceSystemId: null, // 4 this comes from a metadata list
        SourceId: null, // 5920
        SourceIdString: null,
      },
    },
    {
      CounterPartyId: 2956,
      Name: 'DEF Energy Inc.',
      Abbreviation: 'DEF',
      HasCustomerPortal: false,
      CounterpartyCategoryCvId: 502,
      PrimaryInternalCounterpartyId: 1,
      CreditStatusOverrideCvId: null,
      IsActive: true,
      SourceInfo: {
        SourceSystemId: null, // 4 this comes from a metadata list
        SourceId: null, // 5920
        SourceIdString: null,
      },
    },
  ],
}

export const metadataResponse: CounterPartyMetadataResponse = {
  Data: {
    IsSingleSourceSystem: true, // if this is true, the user has no control over the source system id (so its not shown) they can only set a source id
    CounterPartyCategoryList: [
      {
        Text: 'Broker',
        Value: '503',
        GroupingValue: null,
      },
      {
        Text: 'Carrier',
        Value: '502',
        GroupingValue: null,
      },
      {
        Text: 'Customer',
        Value: '501',
        GroupingValue: null,
      },
      {
        Text: 'Internal',
        Value: '500',
        GroupingValue: null,
      },
    ],
    CreditStatusList: [
      {
        Text: 'Credit Hold',
        Value: '5001',
        GroupingValue: null,
      },
      {
        Text: 'Credit Watch',
        Value: '5002',
        GroupingValue: null,
      },
      {
        Text: 'Normal',
        Value: '5000',
        GroupingValue: null,
      },
      {
        Text: 'Off',
        Value: '5003',
        GroupingValue: null,
      },
    ],
    InternalCounterPartyList: [
      {
        Text: 'Irving Oil Limited',
        Value: '1',
        GroupingValue: null,
      },
      {
        Text: 'IRVING OIL LIMITED',
        Value: '5177',
        GroupingValue: null,
      },
      {
        Text: 'IRVING OIL TERMINALS, INC',
        Value: '5176',
        GroupingValue: null,
      },
      {
        Text: 'IRVING OIL WHITEGATE REFINERY LIMITED',
        Value: '5178',
        GroupingValue: null,
      },
      {
        Text: 'Quebec',
        Value: '5179',
        GroupingValue: null,
      },
    ],
    SourceSystemList: [
      // {SourceSystem:"Primary", DataElement:"CounterParty", IsIntegrated: false, IsManaged: true, HasSourceId:true, HasSourceIdString: false}
      // {SourceSystem:"Primary", DataElement:"Product", IsIntegrated: false, IsManaged: true, HasSourceId:true, HasSourceIdString: false}
      // {SourceSystem:"Primary", DataElement:"Location", IsIntegrated: false, IsManaged: true, HasSourceId:true, HasSourceIdString: false}
      // {SourceSystem:"Primary", DataElement:"Colleague", IsIntegrated: false, IsManaged: false, HasSourceId:true, HasSourceIdString: false}
    ], // this is what the user will be able to select from when adding a source (for source system)
  },
  Query: null,
  Validations: [],
}
