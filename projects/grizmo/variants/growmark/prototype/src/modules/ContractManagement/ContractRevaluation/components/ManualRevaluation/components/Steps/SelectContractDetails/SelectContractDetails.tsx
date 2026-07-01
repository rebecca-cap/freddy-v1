import { addCommasToNumber, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  ContractValuation,
  GetMetaDataResponse,
  MetadataItem,
} from '@modules/ContractManagement/ContractRevaluation/api/types'
import { useContractRevaluation } from '@modules/ContractManagement/ContractRevaluation/api/useContractRevaluation'
import { ConfirmRevalueModal } from '@modules/ContractManagement/ContractRevaluation/components/ConfirmRevalueModal'
import { FormInstance } from 'antd'
import moment from 'moment'
import { useMemo, useState } from 'react'

import { SelectContractDetailGrid } from './components/SelectContractDetailGrid'

export interface SelectContractDetailsProps {
  form: FormInstance
  selectedPriceInstruments: MetadataItem[]
  metadata: GetMetaDataResponse['Data']
  selectedContractDetails: ContractValuation[]
  setSelectedContractDetails: React.Dispatch<React.SetStateAction<ContractValuation[]>>
  setActiveStepIndex: React.Dispatch<React.SetStateAction<number>>
}

export function SelectContractDetails({
  form,
  selectedPriceInstruments,
  metadata,
  selectedContractDetails,
  setSelectedContractDetails,
  setActiveStepIndex,
}: SelectContractDetailsProps) {
  const effectiveDates = form.getFieldValue('EffectiveDates')
  const publisherName = metadata?.PricePublishers?.find((p) => p.Value === form.getFieldValue('PricePublisherId'))?.Text
  const [isPopConfirmOpen, setIsPopConfirmOpen] = useState(false)
  const { getContractValuations } = useContractRevaluation()
  const { data: valuationData, isFetching: isValuationFetching } = getContractValuations({
    FromDate: moment(effectiveDates?.[0]).toISOString(),
    ToDate: moment(effectiveDates?.[1]).toISOString(),
    PriceInstrumentIds: selectedPriceInstruments?.map((p) => parseInt(p.Value)),
    TradeEntryIds: [],
    TradeEntryDetailIds: [],
  })

  const hasSelectedRowsWithoutCalenders = useMemo(() => {
    return selectedContractDetails?.some((contract) => !contract.ValuationCalendarId)
  }, [selectedContractDetails])

  return (
    <Vertical>
      <Vertical className='mb-4 mt-1'>
        <Texto category='p2'>Selected contract details will revalue all periods in the selected date range.</Texto>
        <Horizontal style={{ gap: 25 }} className='mt-1'>
          <Texto category='p2'>
            Date Range: {moment(effectiveDates?.[0]).format('YYYY/MM/DD')} -{' '}
            {moment(effectiveDates?.[1]).format('YYYY/MM/DD')}
          </Texto>
          <Texto category='p2'>Publisher: {publisherName}</Texto>
          <Texto category='p2'>Instruments: {addCommasToNumber(selectedPriceInstruments?.length)} selected</Texto>
        </Horizontal>
      </Vertical>
      <SelectContractDetailGrid
        data={valuationData?.Data || []}
        selectedRows={selectedContractDetails}
        setSelectedRows={setSelectedContractDetails}
        form={form}
        isValuationFetching={isValuationFetching}
        metadata={metadata}
      />
      <Horizontal justifyContent='flex-end' className='mt-4'>
        <GraviButton
          buttonText={`Revalue Selected (${selectedContractDetails?.length})`}
          theme1
          onClick={() => setIsPopConfirmOpen(true)}
          disabled={selectedContractDetails?.length === 0}
          loading={isValuationFetching}
        />
      </Horizontal>
      <ConfirmRevalueModal
        onConfirm={() => {
          setIsPopConfirmOpen(false)
          form.submit()
          setActiveStepIndex(2)
        }}
        onCancel={() => {
          setIsPopConfirmOpen(false)
        }}
        isVisible={isPopConfirmOpen}
        startDate={effectiveDates?.[0]}
        endDate={effectiveDates?.[1]}
        hasSelectedRowsWithoutCalenders={hasSelectedRowsWithoutCalenders}
      />
    </Vertical>
  )
}
