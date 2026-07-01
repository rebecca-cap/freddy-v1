import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { useNavigationBlock } from '@hooks/useNavigationBlock'
import { BenchmarkCorrelationDetailsPanel } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/BenchmarkCorrelationDetailsPanel'
import { CreateBenchmark } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/page'
import { ManageBenchmarkCorrelationsGrid } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/Grid/ManageBenchmarkCorrelationsGrid'
import React, { useState } from 'react'

import { BenchmarkCorrelation } from './api/schema.types'
import { useManageBenchmarkCorrelations } from './api/useManageBenchmarkCorrelations'

type ManageBenchmarksProps = {
  canWrite: boolean
}

export function ManageBenchmarkCorrelations({ canWrite }: ManageBenchmarksProps) {
  const { useBenchmarkCorrelations, useBenchmarkCorrelationsMetadata, useCreateCorrelatedAssociationsMutation } =
    useManageBenchmarkCorrelations()

  const { data: benchmarkCorrelationsResponse, isLoading } = useBenchmarkCorrelations()
  const { data: benchmarkCorrelationsMetadataResponse } = useBenchmarkCorrelationsMetadata()
  const createBenchmarkCorrelation = useCreateCorrelatedAssociationsMutation()

  const [isShowingCreateForm, setIsShowingCreateForm] = useState(false)
  const [panelHasChanges, setPanelHasChanges] = useState(false)
  const [selectedRows, setSelectedRows] = useState<BenchmarkCorrelation[]>([])

  useNavigationBlock({
    blockCondition: isShowingCreateForm || panelHasChanges,
    modalTitle: 'Unsaved Changes',
    modalContent: 'You have unsaved changes. Are you sure you want to leave?',
    beforeProceed: async () => {
      setIsShowingCreateForm(false)
      setPanelHasChanges(false)
    },
  })

  return (
    <Horizontal fullHeight>
      <Vertical flex='12'>
        <ManageBenchmarkCorrelationsGrid
          canWrite={canWrite}
          benchmarkCorrelations={benchmarkCorrelationsResponse?.Data}
          setIsShowingCreateForm={setIsShowingCreateForm}
          setSelectedRows={setSelectedRows}
          isLoading={isLoading}
          benchmarkCorrelationsMetadataResponse={benchmarkCorrelationsMetadataResponse}
          createBenchmarkCorrelation={createBenchmarkCorrelation}
        />
      </Vertical>
      <Vertical flex='4'>
        <BenchmarkCorrelationDetailsPanel
          selectedRows={selectedRows}
          panelHasChanges={panelHasChanges}
          setPanelHasChanges={setPanelHasChanges}
          benchmarkCorrelationsMetadataResponse={benchmarkCorrelationsMetadataResponse}
          createBenchmarkCorrelation={createBenchmarkCorrelation}
        />
      </Vertical>
      <CreateBenchmark isShowingCreateForm={isShowingCreateForm} setIsShowingCreateForm={setIsShowingCreateForm} />
    </Horizontal>
  )
}
