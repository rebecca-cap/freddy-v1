import { useApi } from '@gravitate-js/excalibrr'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const endpoints = {
  metadata: 'PriceInstrumentUpload/GetPriceInstrumentUploadData',
  download: 'PriceInstrumentUpload/GetTemplateForPublisher',
  upload: 'PriceInstrumentUpload/UploadInstruments',
  submit: 'PriceInstrumentUpload/SubmitUploadedInstruments',
}

export const usePriceInstruments = () => {
  const api = useApi()

  const useMetadataQuery = () =>
    useQuery([endpoints.metadata], () => api.post(endpoints.metadata), {
      refetchOnWindowFocus: false,
    })
  const getTemplateForPublisher = (pricePublisherId, useOriginLocation) => {
    return api.post(endpoints.download, null, {
      queryParams: new URLSearchParams({ pricePublisherId, useOriginLocation }),
      headers: {
        'Content-Type': 'blob',
      },
    })
  }

  return { useMetadataQuery, getTemplateForPublisher }
}
