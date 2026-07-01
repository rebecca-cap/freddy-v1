export enum PublicationModeOptions {
  EndOfDay = 'EndOfDay',
  EndOfDayCurrentPeriod = 'EndOfDayCurrentPeriod',
  IntraDay = 'IntraDay',
}

// eslint-disable-next-line no-shadow
export enum DirtyUpdateFieldOptions {
  MarketMoveOverride = 'MarketMoveOverride',
  ProposedPrice = 'ProposedPrice',
  Adjustment = 'Adjustment',
}
export type DirtyUpdateField = keyof typeof DirtyUpdateFieldOptions

export type LastEOD = PublicationModeOptions.EndOfDay | PublicationModeOptions.EndOfDayCurrentPeriod
