import type { InferResponse, components } from '@hooks/useTypedApi'

export type PublicationModes = components['schemas']['Services.Shared.QuoteRowPublicationMode']

export type Quote = components['schemas']['QuoteBook.Models.QuoteBookQuoteRow']

export type QuoteBookMetadataResponse = components['schemas']['QuoteBook.MetaData.QuoteBookMetaDataViewModel']

export type PriceException = components['schemas']['QuoteBook.Models.PriceException']

export type QuoteBookOverview = InferResponse<'/api/QuoteBook/GetRows'>
