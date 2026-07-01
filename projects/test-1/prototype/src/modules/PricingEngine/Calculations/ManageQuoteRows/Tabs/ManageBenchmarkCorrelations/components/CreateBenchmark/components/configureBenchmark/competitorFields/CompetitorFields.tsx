import { addCommasToNumber, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { BenchmarkMetadataResponse } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/api/schema.types'
import { CounterpartySelectField } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/competitorFields/CounterpartySelectField'
import { MultipleCompetitorSelectGroup } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/competitorFields/MultipleCompetitorSelectGroup'
import { PublisherSelectField } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/configureBenchmark/PublisherSelectField'
import { blankCompetitorRow } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/components/util'
import { CompetitorTypes } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/types/page.types'
import { Form, Radio } from 'antd'
import React, { useMemo } from 'react'

export interface CompetitorFieldsProps {
  selectedCompetitorType: CompetitorTypes
  metadata?: BenchmarkMetadataResponse
  maxAvailable: number
  normalizeCompetitorWeights: () => void
  selectedPricePublisherIds: string[]
}
export function CompetitorFields({
  selectedCompetitorType,
  metadata,
  maxAvailable,
  normalizeCompetitorWeights,
  selectedPricePublisherIds,
}: CompetitorFieldsProps) {
  const pricePublisherPlaceholder = useMemo(() => {
    if (!selectedCompetitorType) return 'Choose Benchmark Type'
    return selectedCompetitorType === 'Multiple' ? 'Choose price publishers' : 'Choose a price publisher'
  }, [selectedCompetitorType])
  return (
    <>
      <Texto className='mb-1'>Benchmark type</Texto>
      <Form.Item
        name='CompetitorType'
        className='mb-4 w-50'
        rules={[{ required: true, message: 'Please choose a type' }]}
      >
        <Radio.Group name='CompetitorType'>
          <Vertical>
            <Radio value='Single' className='p-1'>
              Single competitor
            </Radio>
            <Radio value='Multiple' className='p-1'>
              Multiple competitors
            </Radio>
          </Vertical>
        </Radio.Group>
      </Form.Item>
      {selectedCompetitorType === 'Single' && (
        <>
          <PublisherSelectField
            metadata={metadata}
            placeholder={pricePublisherPlaceholder}
            isDisabled={!selectedCompetitorType}
          />
          <CounterpartySelectField metadata={metadata} selectedPricePublisherIds={selectedPricePublisherIds} />
        </>
      )}
      {selectedCompetitorType === 'Multiple' && (
        <Form.List name='Competitors' initialValue={[blankCompetitorRow]}>
          {(variables, { add, remove }) => {
            return (
              <Vertical className='mb-2 w-full'>
                <Horizontal className='w-full' justifyContent='space-between'>
                  <Texto className='mb-1'>Competitor Weights</Texto>
                  <GraviButton
                    className='ghost-gravi-button primary-color'
                    buttonText='Add competitor'
                    onClick={() => add(blankCompetitorRow)}
                  />
                </Horizontal>
                {variables.map((variable, index) => (
                  <MultipleCompetitorSelectGroup
                    key={`competitor-row-${index}`}
                    remove={remove}
                    index={index}
                    metadata={metadata}
                    length={variables.length}
                    selectedPricePublisherIds={selectedPricePublisherIds}
                  />
                ))}
                <Horizontal className='w-full ' justifyContent='space-between'>
                  <GraviButton
                    className='ghost-gravi-button primary-color p-0'
                    buttonText='Normalize to 100%'
                    onClick={normalizeCompetitorWeights}
                  />
                  <Texto className='total-percent'> {addCommasToNumber(maxAvailable, 2)} / 100% </Texto>
                </Horizontal>
              </Vertical>
            )
          }}
        </Form.List>
      )}
    </>
  )
}
