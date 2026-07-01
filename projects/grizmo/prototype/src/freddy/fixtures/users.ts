// Freddy mock fixture — fictional
// /Admin/Users — ReadUsers returns { Data: User[] } envelope.
// GetDataForUserManagement returns metadata under .Data with typed lists.
// Crash at colDefs.tsx:295 reads `IdentityProvidersList.find(...)` — provide it.

const role = (id: string, name: string) => ({ Text: name, Value: id, GroupingValue: null })

export const usersMetadataFixture = {
  Data: {
    RoleList: [
      role('1', 'Administrator'),
      role('2', 'Trader'),
      role('3', 'Pricing Analyst'),
      role('4', 'Operations'),
      role('5', 'Viewer'),
      role('6', 'Limited Impersonation'),
    ],
    IdentityProvidersList: [
      { Text: 'Local', Value: '1', GroupingValue: null },
      { Text: 'Azure AD', Value: '2', GroupingValue: null },
      { Text: 'Okta', Value: '3', GroupingValue: null },
    ],
    ContactMethodsList: [
      { Text: 'Email', Value: '1', GroupingValue: null },
      { Text: 'SMS', Value: '2', GroupingValue: null },
      { Text: 'Phone', Value: '3', GroupingValue: null },
    ],
    QuoteConfigurationMappingGroups: [
      { Text: 'Wholesale Rack', Value: '1', GroupingValue: null },
      { Text: 'Bulk Contracts', Value: '2', GroupingValue: null },
      { Text: 'Spot Sales', Value: '3', GroupingValue: null },
    ],
    CounterPartyList: [
      { Text: 'Demo Refining Inc.', Value: '9001', GroupingValue: null },
      { Text: 'Frontier Fuel Services', Value: '9002', GroupingValue: null },
      { Text: 'Cascade Logistics LLC', Value: '9003', GroupingValue: null },
      { Text: 'Prairie Trading Co.', Value: '9004', GroupingValue: null },
      { Text: 'Summit Energy Partners', Value: '9005', GroupingValue: null },
      { Text: 'Bayou Petroleum Group', Value: '9006', GroupingValue: null },
      { Text: 'Northstar Distribution', Value: '9007', GroupingValue: null },
      { Text: 'Mesa Fuel Marketing', Value: '9008', GroupingValue: null },
      { Text: 'Atlas Bulk Carriers', Value: '9009', GroupingValue: null },
      { Text: 'Riverbend Refiners', Value: '9010', GroupingValue: null },
    ],
    LocationList: [
      { Text: 'Houston Terminal', Value: '5001', GroupingValue: null },
      { Text: 'Dallas Hub', Value: '5002', GroupingValue: null },
      { Text: 'Salt Lake Rack', Value: '5003', GroupingValue: null },
      { Text: 'Phoenix Distribution', Value: '5004', GroupingValue: null },
    ],
    AvailablePages: [
      { Text: 'Quote Book EOD', Value: 'QuoteBookEOD', GroupingValue: null },
      { Text: 'Command Center', Value: 'CommandCenter', GroupingValue: null },
      { Text: 'Contracts', Value: 'Contracts', GroupingValue: null },
    ],
    ImpersonationCounterPartyList: [
      { Text: 'Demo Refining Inc.', Value: '9001', GroupingValue: null },
      { Text: 'Frontier Fuel Services', Value: '9002', GroupingValue: null },
      { Text: 'Cascade Logistics LLC', Value: '9003', GroupingValue: null },
    ],
  },
  Query: null,
  Validations: [],
}

const makeUser = (
  id: number,
  first: string,
  last: string,
  email: string,
  cpId: number,
  roles: Array<{ Id: number; Name: string }>,
  opts: Partial<{
    IsActive: boolean
    IsApproved: boolean
    IsLocked: boolean
    IsOptedOutOfMarketingNotifications: boolean
    LastLogin: string
    LoginCount: number
    IdentityProviderId: number
    PreferredContactMethodCvId: number
    QuoteGroups: Array<{ Id: number; Name: string }>
    Impersonations: Array<{ Id: number; CounterPartyName: string; Name: string }>
  }> = {}
) => ({
  ColleagueId: id,
  FirstName: first,
  LastName: last,
  Email: email,
  CounterPartyId: cpId,
  IsActive: opts.IsActive ?? true,
  IsApproved: opts.IsApproved ?? true,
  IsLocked: opts.IsLocked ?? false,
  IsDisabled: !(opts.IsActive ?? true),
  LastLoginDateTime: opts.LastLogin ?? '2026-04-30T14:22:00Z',
  LoginCount: opts.LoginCount ?? 47,
  IsOptedOutOfMarketingNotifications: opts.IsOptedOutOfMarketingNotifications ?? false,
  IdentityProviderId: opts.IdentityProviderId ?? 2,
  ExternalId: `EXT-${id}`,
  PreferredContactMethodCvId: opts.PreferredContactMethodCvId ?? 1,
  QuoteConfigurationMappingGroups: opts.QuoteGroups ?? [{ Id: 1, Name: 'Wholesale Rack' }],
  Roles: roles,
  CounterPartyAssociations: opts.Impersonations ?? [],
})

export const usersReadFixture = {
  TotalRecords: 10,
  Data: [
    makeUser(2001, 'Avery', 'Holloway', 'avery.holloway@demo-refining.test', 9001, [
      { Id: 1, Name: 'Administrator' },
    ], {
      LastLogin: '2026-05-02T07:14:00Z',
      LoginCount: 312,
      QuoteGroups: [
        { Id: 1, Name: 'Wholesale Rack' },
        { Id: 2, Name: 'Bulk Contracts' },
      ],
    }),
    makeUser(2002, 'Marcus', 'Tran', 'marcus.tran@frontier-fuel.test', 9002, [
      { Id: 2, Name: 'Trader' },
    ], { LastLogin: '2026-05-02T06:45:00Z', LoginCount: 198 }),
    makeUser(2003, 'Priya', 'Anand', 'priya.anand@cascade-logistics.test', 9003, [
      { Id: 3, Name: 'Pricing Analyst' },
    ], { LastLogin: '2026-05-01T16:32:00Z', LoginCount: 144, IdentityProviderId: 3 }),
    makeUser(2004, 'Jordan', 'Mireles', 'jordan.mireles@prairie-trading.test', 9004, [
      { Id: 2, Name: 'Trader' },
      { Id: 3, Name: 'Pricing Analyst' },
    ], {
      LastLogin: '2026-05-01T11:08:00Z',
      LoginCount: 87,
      QuoteGroups: [{ Id: 2, Name: 'Bulk Contracts' }],
    }),
    makeUser(2005, 'Sarah', 'Okafor', 'sarah.okafor@summit-energy.test', 9005, [
      { Id: 4, Name: 'Operations' },
    ], { LastLogin: '2026-04-29T09:12:00Z', LoginCount: 56, PreferredContactMethodCvId: 2 }),
    makeUser(2006, 'Ben', 'Lindgren', 'ben.lindgren@bayou-petroleum.test', 9006, [
      { Id: 5, Name: 'Viewer' },
    ], {
      IsApproved: false,
      LastLogin: '2026-04-22T13:55:00Z',
      LoginCount: 8,
    }),
    makeUser(2007, 'Diana', 'Chevalier', 'diana.chevalier@northstar-dist.test', 9007, [
      { Id: 2, Name: 'Trader' },
    ], { IsLocked: true, LastLogin: '2026-04-12T10:00:00Z', LoginCount: 41 }),
    makeUser(2008, 'Theo', 'Brennan', 'theo.brennan@mesa-fuel.test', 9008, [
      { Id: 1, Name: 'Administrator' },
      { Id: 6, Name: 'Limited Impersonation' },
    ], {
      LastLogin: '2026-05-02T05:30:00Z',
      LoginCount: 256,
      Impersonations: [
        { Id: 9001, CounterPartyName: 'Demo Refining Inc.', Name: 'Demo Refining Inc.' },
        { Id: 9002, CounterPartyName: 'Frontier Fuel Services', Name: 'Frontier Fuel Services' },
      ],
    }),
    makeUser(2009, 'Renee', 'Pak', 'renee.pak@atlas-bulk.test', 9009, [
      { Id: 3, Name: 'Pricing Analyst' },
      { Id: 4, Name: 'Operations' },
    ], { LastLogin: '2026-04-30T18:42:00Z', LoginCount: 119, IsOptedOutOfMarketingNotifications: true }),
    makeUser(2010, 'Owen', 'Saldivar', 'owen.saldivar@riverbend-ref.test', 9010, [
      { Id: 5, Name: 'Viewer' },
    ], {
      IsActive: false,
      LastLogin: '2026-02-14T08:20:00Z',
      LoginCount: 12,
    }),
  ],
  Query: null,
  Validations: [],
}
