import { useApi } from '@gravitate-js/excalibrr'
import {
  ConflictDetailsRequest,
  ConflictDetailsResponse,
  PriceMetadataResponse,
  PriceSubmitPayload,
  PriceSubmitResponse,
  PriceUploadResponse,
} from '@modules/Admin/ManagePrices/api/types.schema'
import { useQuery } from '@tanstack/react-query'

export const endpoints = {
  metadata: 'PriceUpload/GetPriceUploadData',
  download: 'PriceUpload/GetTemplateForPublisher',
  upload: 'PriceUpload/UploadPriceFile',
  submit: 'PriceUpload/SubmitUploadedPrices',
  conflictDetails: 'PriceUpload/GetPriceConflictDetails',
}

export const useManagePrices = () => {
  const api = useApi()

  const useMetadataQuery = () =>
    useQuery([endpoints.metadata], () => api.post(endpoints.metadata) as Promise<PriceMetadataResponse>, {
      refetchOnWindowFocus: false,
    })

  const uploadFile = async (formData: FormData): Promise<PriceUploadResponse> => {
    return api.uploadFile(endpoints.upload, formData, {
      headers: { Accept: 'application/json' },
    }) as Promise<PriceUploadResponse>
  }

  const submitPrices = async (payload: PriceSubmitPayload[]): Promise<PriceSubmitResponse> => {
    return api.post(endpoints.submit, payload as any) as Promise<PriceSubmitResponse>
  }

  const getTemplateForPublisher = (
    pricePublisherId: number,
    curveIdentifierTypeId: string,
    priceUploadTypeId: number,
    includeFutureEffectivePrices: boolean
  ): Promise<Response> => {
    return api.post(endpoints.download, null, {
      queryParams: new URLSearchParams({
        pricePublisherId: pricePublisherId.toString(),
        identifierType: curveIdentifierTypeId,
        uploadType: priceUploadTypeId.toString(),
        includeFutureEffectivePrices,
      }),
      headers: {
        'Content-Type': 'blob',
      },
    })
  }

  const getConflictDetails = async (curvePointIds: number[]): Promise<ConflictDetailsResponse> => {
    const payload: ConflictDetailsRequest = {
      CurvePointIds: curvePointIds,
    }
    return api.post(endpoints.conflictDetails, payload as any) as Promise<ConflictDetailsResponse>
  }

  return {
    useMetadataQuery,
    uploadFile,
    submitPrices,
    getTemplateForPublisher,
    getConflictDetails,
  }
}
