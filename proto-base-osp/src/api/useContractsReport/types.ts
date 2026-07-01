import type { components } from '@hooks/useTypedApi'

// BE-backed — inferred from the OpenAPI schema.

export type Validation = components['schemas']['Library.Validation.ValidationResult']

export type ContractData = components['schemas']['CoreModel.DtoClasses.CMContractReportRowDDTO']

export type ContractReportDetail =
  components['schemas']['DtoClasses.CMContractReportRowDDTOTypes.CMContractReportDetailDDTO']

export type Quantity =
  components['schemas']['CMContractReportRowDDTOTypes.CMContractReportDetailDDTOTypes.CMContractReportQuantityDDTO']

export type ContractGetAllResponse = components['schemas']['Base.DataRequests.CMContractReportRowDDTODataCollectionResult']

export type ValuationData = components['schemas']['ContractManagement.ServiceComponents.CMDetailValuationDataResponse']

export type GetDetailValuationDataResponse =
  components['schemas']['Base.DataRequests.CMDetailValuationDataResponseDataCollectionResult']

// FE merges a contract detail with its valuation row — used by ContractDetailRow.tsx
// to display per-detail valuation alongside the detail row.
export type MergedContractDetailData = ContractReportDetail & ValuationData
