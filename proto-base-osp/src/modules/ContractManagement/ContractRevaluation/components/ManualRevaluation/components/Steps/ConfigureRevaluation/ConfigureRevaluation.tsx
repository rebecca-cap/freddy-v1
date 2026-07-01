import { Vertical } from '@gravitate-js/excalibrr'
import { MetadataItem } from '@modules/ContractManagement/ContractRevaluation/api/types'
import { AffectedInstrumentsGrid } from '@modules/ContractManagement/ContractRevaluation/components/ManualRevaluation/components/Steps/ConfigureRevaluation/components/AffectedInstrumentsGrid'
import { Publisher } from '@modules/ContractManagement/ContractRevaluation/components/ManualRevaluation/components/Steps/ConfigureRevaluation/components/Publisher'
import { RevaluationWindow } from '@modules/ContractManagement/ContractRevaluation/components/ManualRevaluation/components/Steps/ConfigureRevaluation/components/RevaluationWindow'
import { ManualRevaluationStepProps } from '@modules/ContractManagement/ContractRevaluation/components/ManualRevaluation/components/Steps/StepContentMap'
import { Form } from 'antd'
import { useMemo } from 'react'

export function ConfigureRevaluation({
  metadata,
  form,
  setSelectedPriceInstruments,
  selectedPriceInstruments,
}: ManualRevaluationStepProps) {
  const selectedPublisherId = Form.useWatch('PricePublisherId', form)
  const filteredInstruments: MetadataItem[] =
    metadata?.PriceInstruments?.filter((i) => i.GroupingValue === selectedPublisherId) || []
  const publisherName = useMemo(
    () => metadata?.PricePublishers?.find((p) => p.Value === selectedPublisherId)?.Text,
    [metadata, selectedPublisherId]
  )

  return (
    <Vertical className='mt-4'>
      <RevaluationWindow form={form} />
      <Publisher metadata={metadata} />
      {selectedPublisherId && (
        <AffectedInstrumentsGrid
          data={filteredInstruments}
          setSelectedPriceInstruments={setSelectedPriceInstruments}
          selectedPublisherName={publisherName || ''}
          selectedPriceInstruments={selectedPriceInstruments}
          form={form}
        />
      )}
    </Vertical>
  )
}
