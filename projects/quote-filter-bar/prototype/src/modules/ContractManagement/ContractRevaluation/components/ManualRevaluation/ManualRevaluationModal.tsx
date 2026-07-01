import '../../styles.css'

import { dateFormat } from '@components/TheArmory/helpers'
import { Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  ContractValuation,
  ExecuteRevaluationRequest,
  GetMetaDataResponse,
  MetadataItem,
  RevaluationPriceChange,
} from '@modules/ContractManagement/ContractRevaluation/api/types'
import { ManualRevaluationFooter } from '@modules/ContractManagement/ContractRevaluation/components/ManualRevaluation/components/ManualRevaluationFooter'
import { RevaluationStepHeader } from '@modules/ContractManagement/ContractRevaluation/components/ManualRevaluation/components/ManualRevaluationStepHeader'
import { revaluationStepContentMap } from '@modules/ContractManagement/ContractRevaluation/components/ManualRevaluation/components/Steps/StepContentMap'
import { revaluationSteps } from '@modules/ContractManagement/ContractRevaluation/components/ManualRevaluation/utils'
import { Form, Modal } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'

import { useContractRevaluation } from '../../api/useContractRevaluation'

export interface ManualRevaluationModalProps {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  metadata?: GetMetaDataResponse['Data']
}

export function ManualRevaluationModal({ isModalOpen, setIsModalOpen, metadata }: ManualRevaluationModalProps) {
  const [form] = Form.useForm()
  const [selectedPriceInstruments, setSelectedPriceInstruments] = useState<MetadataItem[]>([])
  const [selectedContractDetails, setSelectedContractDetails] = useState<ContractValuation[]>([])
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [selectedDates, setSelectedDates] = useState<Partial<ExecuteRevaluationRequest>>()
  const { executeRevaluation } = useContractRevaluation()
  const currentStep = revaluationSteps[activeStepIndex]
  const StepContent = revaluationStepContentMap[activeStepIndex]
  const [revaluationResults, setRevaluationResults] = useState<RevaluationPriceChange[]>([])
  const [isLoadingResults, setIsLoadingResults] = useState(false)
  const ModalTitle = () => {
    return (
      <Vertical>
        <Horizontal>
          <Texto category={'h4'}>Manual Contract Revaluation</Texto>
        </Horizontal>
        <Horizontal className={'mt-2'}>
          <Texto category={'p1'}>Revalue historical contract pricing periods</Texto>
        </Horizontal>
      </Vertical>
    )
  }

  const onBack = () => {
    setActiveStepIndex((current) => Math.max(current - 1, 0))
  }
  const onClose = () => {
    setActiveStepIndex(0)
    form.resetFields()
    setSelectedPriceInstruments([])
    setSelectedContractDetails([])
    setIsModalOpen(false)
  }
  const onNext = async () => {
    try {
      await form.validateFields()
      const all = form.getFieldsValue()
      setSelectedDates({
        StartDate: all.EffectiveDates?.[0],
        EndDate: all.EffectiveDates?.[1],
      })
      setActiveStepIndex((prev) => Math.min(prev + 1, revaluationSteps.length - 1))
    } catch (err) {
      // form validation failed; do not proceed
      console.warn('Validation failed:', err)
    }
  }
  const revaluate = executeRevaluation()

  const onFinish = async (values: any) => {
    setIsLoadingResults(true)
    const startDate = moment(selectedDates?.StartDate).format(dateFormat.ISO)
    const endDate = moment(selectedDates?.EndDate).format(dateFormat.ISO)
    const payload = {
      StartDate: startDate,
      EndDate: endDate,
      TradeEntryDetailIds: values.selectContractDetails.map((i) => i.TradeEntryDetailId),
      TradeEntryIds: values.selectContractDetails.map((i) => i.TradeEntryId),
    }
    try {
      const res = await revaluate.mutateAsync(payload as ExecuteRevaluationRequest)
      setRevaluationResults(res?.Data?.UpdatedPrices || [])
    } catch (error) {
      console.error('Revaluation failed:', error)
      NotificationMessage('Revaluation Error', 'An error occurred while revaluating contracts.', true)
    } finally {
      setIsLoadingResults(false)
    }
  }

  return (
    <Modal
      visible={isModalOpen}
      title={<ModalTitle />}
      destroyOnClose={true}
      onCancel={onClose}
      className='manual-revaluation-modal'
      width='65vw'
      footer={
        <ManualRevaluationFooter
          totalSteps={revaluationSteps?.length}
          activeStepIndex={activeStepIndex}
          onBack={onBack}
          onNext={onNext}
          onClose={onClose}
        />
      }
    >
      <div className={'content-container'}>
        <RevaluationStepHeader
          activeStepIndex={activeStepIndex}
          step={currentStep}
          totalSteps={revaluationSteps?.length}
        />
        <Form form={form} layout='vertical' onFinish={onFinish}>
          <StepContent
            metadata={metadata}
            form={form}
            selectedPriceInstruments={selectedPriceInstruments}
            setSelectedPriceInstruments={setSelectedPriceInstruments}
            setSelectedContractDetails={setSelectedContractDetails}
            selectedContractDetails={selectedContractDetails}
            setActiveStepIndex={setActiveStepIndex}
            revaluationResults={revaluationResults}
            selectedDates={selectedDates}
            isLoadingResults={isLoadingResults}
            onClose={onClose}
          />
        </Form>
      </div>
    </Modal>
  )
}
