import { IndexOfferFormulaComponent } from '@modules/Dashboard/SpecialOffers/Api/types.schema'

export const blankFormulaComponentRow = (id: number): IndexOfferFormulaComponent => ({
  Percentage: null,
  PricePublisherId: null,
  PriceInstrumentId: null,
  PriceValuationRuleId: null,
  PriceTypeCvId: null,
  DisplayName: null,
  Differential: null,
  IdForGrid: id,
})
