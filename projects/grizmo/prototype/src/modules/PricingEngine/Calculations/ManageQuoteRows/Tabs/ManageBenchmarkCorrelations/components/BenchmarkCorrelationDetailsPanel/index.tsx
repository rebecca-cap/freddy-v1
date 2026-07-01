import '../styles.css'

import { Horizontal, NotificationMessage, Texto, Vertical } from '@gravitate-js/excalibrr'
import {
  BenchmarkCorrelation,
  benchmarkKeyMap,
  benchmarkKeys,
  BenchmarkMetadataBenchmarkItem,
  BenchmarkMetadataResponse,
  BenchmarkTypes,
  CreateCorrelatedAssociationRequest,
  CreateCorrelatedAssociationRequestPayload,
  CreateCorrelatedAssociationsResponse,
} from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/api/schema.types'
import { BenchmarkCorrelationsFooter } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/BenchmarkCorrelationDetailsPanel/BenchmarkCorrelationsFooter'
import { NoRowsSelected } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/BenchmarkCorrelationDetailsPanel/NoRowsSelected'
import { SelectBenchmark } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/BenchmarkCorrelationDetailsPanel/SelectBenchmark/SelectBenchmark'
import { SelectBenchmarkType } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/BenchmarkCorrelationDetailsPanel/SelectBenchmark/SelectBenchmarkType'
import { getBenchmarkList } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/util'
import { UseMutationResult } from '@tanstack/react-query'
import { Form } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { SelectRowsDisplay } from 'src/modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/BenchmarkCorrelationDetailsPanel/SelectedRowsDisplay'

import { AnalysisView } from './AnalysisView/AnalysisView'

type ManageBenchmarkDetailsProps = {
  selectedRows: BenchmarkCorrelation[]
  panelHasChanges: boolean
  setPanelHasChanges: React.Dispatch<React.SetStateAction<boolean>>
  benchmarkCorrelationsMetadataResponse: BenchmarkMetadataResponse | undefined
  createBenchmarkCorrelation: UseMutationResult<
    CreateCorrelatedAssociationsResponse,
    unknown,
    CreateCorrelatedAssociationRequest[],
    unknown
  >
}

export function BenchmarkCorrelationDetailsPanel({
  selectedRows,
  panelHasChanges,
  setPanelHasChanges,
  benchmarkCorrelationsMetadataResponse,
  createBenchmarkCorrelation,
}: ManageBenchmarkDetailsProps) {
  const [form] = Form.useForm()
  const [selectedType, setSelectedType] = useState<BenchmarkTypes>('Spot')
  const [currentFormValues, setCurrentFormValues] = useState<Record<string, number | undefined>>({})
  // set the dirty state to false on load since we're programmatically filling in the form
  useEffect(() => {
    setPanelHasChanges(false)
  }, [])

  const onValuesChange = (values: Record<string, number | undefined>) => {
    setCurrentFormValues(values)
    setPanelHasChanges(true)
  }

  const benchmarkList = useMemo<BenchmarkMetadataBenchmarkItem[]>(() => {
    return getBenchmarkList(benchmarkCorrelationsMetadataResponse, selectedType)
  }, [benchmarkCorrelationsMetadataResponse, selectedType])

  const setForm = () => {
    form.resetFields()
    const benchmarkKeysList = Object.values(benchmarkKeyMap)
    const selectedRow = selectedRows[0]
    const singleRowSelected = selectedRows?.length === 1

    const newValues: Record<string, number | undefined> = {}

    benchmarkKeysList.forEach((key) => {
      newValues[key] = singleRowSelected ? selectedRow[key]?.CorrelatedCalculationId : undefined
    })
    form.setFieldsValue(newValues)
    setCurrentFormValues(newValues)
    setPanelHasChanges(false)
  }

  const onSubmitForm = async () => {
    const formValues = form.getFieldsValue(true)
    const payload = selectedRows.map((row) => {
      const benchmarkIds: number[] = []

      benchmarkKeys.forEach((benchmarkKey) => {
        const formValue = formValues[benchmarkKey]
        const rowBenchmarkId = formValue ?? row[benchmarkKey]?.CorrelatedCalculationId
        if (rowBenchmarkId) {
          benchmarkIds.push(rowBenchmarkId)
        }
      })

      return {
        QuoteConfigurationMappingId: row.QuoteConfigurationMappingId,
        CorrelatedBenchmarkIds: [...benchmarkIds],
      }
    }) as CreateCorrelatedAssociationRequestPayload

    const response = await createBenchmarkCorrelation.mutateAsync(payload)
    if (response?.Validations.length || response?.message) {
      NotificationMessage('Error', response.Validations[0]?.Message ?? response?.message)
    } else {
      NotificationMessage('Save Successful', `Benchmark details updated`, false)
    }
    setPanelHasChanges(false)
  }

  if (!selectedRows?.length) {
    return <NoRowsSelected />
  }

  return (
    <Form
      className='form-height-width'
      name='BenchmarkDetails'
      form={form}
      layout='vertical'
      onFinish={onSubmitForm}
      onValuesChange={onValuesChange}
    >
      <Horizontal className='bg-2 bordered' fullHeight>
        <Vertical>
          <Horizontal className='border-bottom bg-2 p-4'>
            <Texto category='h6' className='mx-2'>
              Benchmark Details
            </Texto>
          </Horizontal>
          <SelectRowsDisplay
            selectedRows={selectedRows}
            updateAssignedBenchmarks={createBenchmarkCorrelation.isSuccess}
          />
          <SelectBenchmarkType selectedType={selectedType} setSelectedType={setSelectedType} />
          <SelectBenchmark
            selectedRows={selectedRows}
            selectedType={selectedType}
            benchmarkList={benchmarkList}
            setForm={setForm}
          />

          {selectedRows?.length === 1 && (
            <AnalysisView selectedRows={selectedRows} selectedType={selectedType} formValues={currentFormValues} />
          )}

          <BenchmarkCorrelationsFooter
            form={form}
            setForm={setForm}
            panelHasChanges={panelHasChanges}
            createBenchmarkCorrelation={createBenchmarkCorrelation}
          />
        </Vertical>
      </Horizontal>
    </Form>
  )
}
