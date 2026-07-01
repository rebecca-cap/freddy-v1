import type { InferRequestBody, InferResponse, components } from '@hooks/useTypedApi'

export type OnlineOrdersRequest = InferRequestBody<'/api/MarketPlatform/OnlineOrders/GetOrders'>

export type OnlineOrderRow = components['schemas']['CoreModel.DtoClasses.OnlineOrderDDTO']

export type OnlineOrdersResponse = InferResponse<'/api/MarketPlatform/OnlineOrders/GetOrders'>

export type SelectListItem = components['schemas']['Core.Library.SelectListItem']

export type OnlineOrdersMetaData = components['schemas']['OrderReporting.Models.OnlineOrdersMetaDataModel']
