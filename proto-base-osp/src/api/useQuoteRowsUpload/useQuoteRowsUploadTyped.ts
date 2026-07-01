/**
 * Type-safe Quote Rows Upload API hook using OpenAPI generated types.
 *
 * The Upload endpoint uses multipart/form-data, which openapi-fetch can't
 * encode, so it goes through the shared fetchUploadFile helper instead.
 */

import { useAuth } from '@gravitate-js/excalibrr'
import { type InferRequestBody, type InferResponse, queryKey, unwrap, useTypedApi } from '@hooks/useTypedApi'
import { useQuery } from '@tanstack/react-query'
import { fetchUploadFile } from '@utils/fetchUploadFile'

export type QuoteRowsUploadMetadataResponse = InferResponse<'/api/QuoteConfigurationManagement/Uploader/MetaData'>
export type QuoteRowsUploadTemplateResponse = InferResponse<'/api/QuoteConfigurationManagement/Uploader/GetRowTemplate'>
export type QuoteRowsUploadResponse = InferResponse<'/api/QuoteConfigurationManagement/Uploader/Upload'>

export type QuoteRowsUploadTemplateRequest =
  InferRequestBody<'/api/QuoteConfigurationManagement/Uploader/GetRowTemplate'>

// Query Keys

const queryKeys = {
  metadata: queryKey('/api/QuoteConfigurationManagement/Uploader/MetaData'),
  template: (quoteConfigurationId: number) =>
    [...queryKey('/api/QuoteConfigurationManagement/Uploader/GetRowTemplate'), quoteConfigurationId] as const,
} as const

export const useQuoteRowsUploadTyped = () => {
  const api = useTypedApi()
  const { baseUrl } = useAuth()

  /**
   * Fetch metadata for quote rows upload
   */
  const useMetadataQuery = () =>
    useQuery({
      queryKey: queryKeys.metadata,
      queryFn: () => unwrap(api.POST('/api/QuoteConfigurationManagement/Uploader/MetaData')),
      refetchOnWindowFocus: false,
    })

  /**
   * Get template by quote configuration
   * Returns blob data for file download
   */
  const getTemplateByQuoteConfig = async (QuoteConfigurationId: number): Promise<Blob | undefined> => {
    const { data, error } = await api.POST('/api/QuoteConfigurationManagement/Uploader/GetRowTemplate', {
      body: { QuoteConfigurationId },
      parseAs: 'blob',
    })

    if (error) return undefined

    return data as Blob | undefined
  }

  /**
   * Upload a quote rows file. AutoSubmitIfValid controls whether the server
   * persists rows immediately when validation passes or returns them for preview.
   */
  const uploadFile = async (autoSubmitIfValid: boolean, formData: FormData) =>
    fetchUploadFile<QuoteRowsUploadResponse>(
      baseUrl,
      `/api/QuoteConfigurationManagement/Uploader/Upload?AutoSubmitIfValid=${autoSubmitIfValid}`,
      formData
    )

  return {
    useMetadataQuery,
    getTemplateByQuoteConfig,
    uploadFile,
  }
}
