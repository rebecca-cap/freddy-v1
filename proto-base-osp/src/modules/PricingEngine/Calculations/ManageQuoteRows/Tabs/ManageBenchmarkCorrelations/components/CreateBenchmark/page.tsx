import './components/style.css'

import { NotificationMessage } from '@gravitate-js/excalibrr'
import { CreateBenchmarkPayload } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/api/schema.types'
import { useCreateBenchmarksTyped } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/api/useCreateBenchmarksTyped'
import { ConfigureBenchmark } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/ConfigureBenchmark'
import { CreateFooter } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/CreateFooter'
import { CreateHeader } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/CreateHeader'
import {
  constructBaseObject,
  constructCompetitorPayload,
  onCompetitorListChanged,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/events'
import { SelectType } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/selectBenchmarkType/SelectType'
import {
  benchmarkTypes,
  blankCompetitorRow,
  createWizardStates,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/util'
import {
  BenchmarkTypes,
  CompetitorTypes,
  CreateWizardStates,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/types/page.types'
import { Drawer, Form } from 'antd'
import React, { useEffect, useState } from 'react'

export interface CreateBenchmarkProps {
  isShowingCreateForm: boolean
  setIsShowingCreateForm: React.Dispatch<React.SetStateAction<boolean>>
}
export function CreateBenchmark({ isShowingCreateForm, setIsShowingCreateForm }: CreateBenchmarkProps) {
  const [currentState, setCurrentState] = useState<CreateWizardStates>(createWizardStates.isSelectingType)
  const [selectedType, setSelectedType] = useState<BenchmarkTypes>(benchmarkTypes.Spot)
  const [selectedCompetitorType, setSelectedCompetitorType] = useState<CompetitorTypes>(null)
  const [selectedPricePublisherIds, setSelectedPricePublisherIds] = useState([''])
  const [maxAvailable, setMaxAvailable] = useState(100)
  const [isLoading, setIsLoading] = useState(false)
  const [form] = Form.useForm()
  const resetAndClose = () => {
    form.resetFields()
    form.setFieldsValue({ Competitors: [blankCompetitorRow] })
    setSelectedCompetitorType(null)
    setMaxAvailable(100)
    setIsShowingCreateForm(false)
  }
  const {
    useBenchmarkMetadata,
    createSpotBenchmark,
    createRackAverageBenchmark,
    createRackLowBenchmark,
    createCompetitorBenchmark,
  } = useCreateBenchmarksTyped()
  const { data: benchmarkMetadata } = useBenchmarkMetadata()
  const getMutateFunction = () => {
    if (selectedType === benchmarkTypes.Spot) {
      return createSpotBenchmark.mutateAsync
    }
    if (selectedType === benchmarkTypes.Rack) {
      const rackType = form.getFieldValue('RackType')
      if (rackType === 'RackAverage') {
        return createRackAverageBenchmark.mutateAsync
      }
      return createRackLowBenchmark.mutateAsync
    }
    return () => Promise.reject()
  }

  async function submitNonCompetitorCreate(values: any, baseObject: any) {
    const payload: CreateBenchmarkPayload = {
      ...baseObject,
      PricePublisherId: values.PricePublisherId,
    }
    const mutate = getMutateFunction()
    await mutate(payload)
  }

  async function submitCompetitorCreate(values: any, baseObject: any) {
    const competitorPayload = constructCompetitorPayload({
      values,
      baseObject,
      selectedCompetitorType,
    })
    await createCompetitorBenchmark.mutateAsync(competitorPayload)
  }
  const onSubmitForm = async (values: any) => {
    setIsLoading(true)
    const baseObject = constructBaseObject(values)
    try {
      if (selectedType === benchmarkTypes.Competitor) {
        await submitCompetitorCreate(values, baseObject)
      } else {
        await submitNonCompetitorCreate(values, baseObject)
      }
      NotificationMessage('Benchmark created successfully', `The ${values.Name} benchmark has been created.`, false)
      resetAndClose()
    } catch (error) {
      const message = error?.json?.Validations?.[0]?.Message || 'An error occurred while creating the benchmark.'
      NotificationMessage('Failed to create benchmark', `Error: ${message}`, true)
      return
    } finally {
      setIsLoading(false)
    }
  }
  const onValuesChange = (changedValues: any, allValues: any) => {
    setSelectedPricePublisherIds(
      allValues?.PricePublisherId
        ? [allValues?.PricePublisherId]
        : allValues?.Competitors?.map((c) => c.PricePublisherId)
    )

    if (changedValues.benchmarkType) {
      setSelectedType(changedValues.benchmarkType)
    }
    if (changedValues.CompetitorType) {
      setSelectedCompetitorType(changedValues.CompetitorType)
    }
    if (changedValues.Competitors) onCompetitorListChanged({ allValues, changedValues, form, setMaxAvailable })
  }

  const normalizeCompetitorWeights = () => {
    form.setFieldsValue({
      Competitors: form
        .getFieldValue('Competitors')
        .map((competitor: any) => ({ ...competitor, Percentage: 100 / form.getFieldValue('Competitors').length })),
    })
    setMaxAvailable(0)
  }

  useEffect(() => {
    if (isShowingCreateForm) {
      setCurrentState(createWizardStates.isSelectingType)
      setSelectedType(benchmarkTypes.Spot)
      form.setFieldsValue({ benchmarkType: benchmarkTypes.Spot })
    }
  }, [isShowingCreateForm])

  return (
    <Drawer
      className='create-benchmark-drawer'
      width='850px'
      closeIcon={null}
      title={
        <CreateHeader
          resetAndClose={resetAndClose}
          currentState={currentState}
          selectedType={selectedType}
          isLoading={isLoading}
        />
      }
      open={isShowingCreateForm}
      destroyOnHidden
      footer={
        <CreateFooter
          resetAndClose={resetAndClose}
          form={form}
          currentState={currentState}
          setCurrentState={setCurrentState}
          isLoading={isLoading}
        />
      }
    >
      <Form form={form} layout='vertical' onFinish={onSubmitForm} onValuesChange={onValuesChange}>
        {currentState === createWizardStates.isSelectingType ? (
          <SelectType selectedType={selectedType} setCurrentState={setCurrentState} resetAndClose={resetAndClose} />
        ) : (
          <ConfigureBenchmark
            selectedType={selectedType}
            selectedCompetitorType={selectedCompetitorType}
            metadata={benchmarkMetadata}
            maxAvailable={maxAvailable}
            normalizeCompetitorWeights={normalizeCompetitorWeights}
            selectedPricePublisherIds={selectedPricePublisherIds}
          />
        )}
      </Form>
    </Drawer>
  )
}
