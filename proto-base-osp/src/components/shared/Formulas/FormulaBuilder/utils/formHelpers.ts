import type { FormulaBuilderMetadata } from '../types'

export const validateInstrument = (
  value: string | null | undefined,
  selectedPublisherId: string | null,
  metadata: FormulaBuilderMetadata | undefined
) => {
  if (!value) {
    return Promise.reject(new Error('Instrument is required'))
  }

  const validInstruments = metadata?.PublisherPriceInstruments[selectedPublisherId] || []
  const isValid = validInstruments.some((inst) => inst.Value?.toString() === value?.toString())

  if (!isValid) {
    return Promise.reject(new Error('Not valid for publisher'))
  }
  return Promise.resolve()
}

export const validatePriceType = (
  value: string | null | undefined,
  selectedPublisherId: string | null,
  metadata: FormulaBuilderMetadata | undefined
) => {
  if (!value) {
    return Promise.reject(new Error('Type is required'))
  }

  const validTypes = metadata?.PublisherPriceTypes[selectedPublisherId] || []
  const isValid = validTypes.some((type) => type.Value == value || type.Text == value)
  if (!isValid) {
    return Promise.reject(new Error('Not valid for publisher'))
  }
  return Promise.resolve()
}
