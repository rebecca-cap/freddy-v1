import { GraviButton, Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { CreateCorrelatedAssociationRequestPayload } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/api/schema.types'
import { UseMutationResult } from '@tanstack/react-query'
import { Button } from 'antd'
import type { FormInstance } from 'antd'
import React from 'react'

type BenchmarkCorrelationsFooterProps = {
  form: FormInstance
  setForm: () => void
  panelHasChanges: boolean
  createBenchmarkCorrelation: UseMutationResult<any, any, CreateCorrelatedAssociationRequestPayload, unknown>
}

export function BenchmarkCorrelationsFooter({
  form,
  setForm,
  panelHasChanges,
  createBenchmarkCorrelation,
}: BenchmarkCorrelationsFooterProps) {
  const onRevert = () => {
    setForm()
  }

  return (
    <Vertical justifyContent='end' flex={1} >
      <Horizontal
        className='border-top'
        style={{
          padding: 16,
          justifyContent: 'flex-end',
          gap: 10,
        }}
      >
        <Button title='revert' name='revert' shape='round' type='link' onClick={onRevert} disabled={!panelHasChanges}>
          Revert
        </Button>
        <GraviButton
          loading={createBenchmarkCorrelation?.isPending}
          success
          buttonText='Save Changes'
          onClick={() => form.submit()}
          disabled={!panelHasChanges}
        />
      </Horizontal>
    </Vertical>
  )
}
