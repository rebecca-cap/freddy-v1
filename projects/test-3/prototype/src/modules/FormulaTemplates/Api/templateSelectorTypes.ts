import { MetadataListResponseItem } from '@api/globalTypes'
import { MomentInput } from 'moment'

import { FormulaTemplateDetails } from './types.schema'

export interface TemplateSelectorMetadata {
  ProductList: MetadataListResponseItem[]
  LocationList: MetadataListResponseItem[]
  PriceTypeList: MetadataListResponseItem[]
  PricePublisherList: MetadataListResponseItem[]
  PriceInstrumentList: MetadataListResponseItem[]
  TradePriceValuationRuleList: MetadataListResponseItem[]
  FormulaTemplates: FormulaTemplateDetails[]
}

export interface TemplateSelectorHeaderContext {
  effectiveFromDate?: MomentInput
  effectiveToDate?: MomentInput
}
