import { MetadataListResponseItem } from '@api/globalTypes'
import type { ConfigType as DayjsInput } from 'dayjs'

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
  effectiveFromDate?: DayjsInput
  effectiveToDate?: DayjsInput
}
