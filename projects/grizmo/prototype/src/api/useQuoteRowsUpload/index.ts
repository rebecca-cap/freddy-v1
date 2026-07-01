import { useApi } from '@gravitate-js/excalibrr'
import { useQuery } from '@tanstack/react-query'

export const endpoints = {
  metadata: 'QuoteConfigurationManagement/Uploader/MetaData',
  download: 'QuoteConfigurationManagement/Uploader/GetRowTemplate',
  upload: 'QuoteConfigurationManagement/Uploader/Upload',
}

export const useQuoteRowsUpload = () => {
  const api = useApi()

  const useMetadataQuery = () =>
    useQuery([endpoints.metadata], () => api.post(endpoints.metadata), {
      refetchOnWindowFocus: false,
    })

  const getTemplateByQuoteConfig = (QuoteConfigurationId) => {
    return api.post(
      endpoints.download,
      { QuoteConfigurationId },
      {
        responseType: 'blob',
      }
    )
  }

  const uploadFile = (autoSubmit, data) => {
    return api.postFormData(`${endpoints.upload}?AutoSubmitIfValid=${autoSubmit}`, data)
  }

  return { useMetadataQuery, getTemplateByQuoteConfig, uploadFile }
}
