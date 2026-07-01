import './index.css'

import { LoadingOutlined } from '@ant-design/icons'
import { MarketPlatformFormulaAffectedSetupsResponse } from '@api/useMarketPlatformFormulas/types'
import { IFormulaMetadataResponse, IFormulaOverviewResponse } from '@api/usePriceEngineFormulas/types'
import { Spin, Tabs } from 'antd'
import React, { useCallback, useRef } from 'react'

import { NewMappingForm } from '../NewMappingForm'
import { AffectedQuotesTab, QuoteRow } from './components/AffectedQuotesTab'
import { AppliesToTab } from './components/AppliesToTab'

interface IProps {
  hasAppliesToChanged: boolean
  selectedFormula: IFormulaOverviewResponse['Data'][number]
  handleNewMappingSubmit: typeof NewMappingForm.defaultProps.onSubmit
  handleMappingDelete: (
    id: IFormulaOverviewResponse['Data'][number]['AppliesTo'][number]['FormulaReferenceDataMappingId']
  ) => void
  metadata: IFormulaMetadataResponse
  onSelectQuoteRow?: (_selectedRow: QuoteRow) => void
  canWrite: boolean
  affectedSetups: MarketPlatformFormulaAffectedSetupsResponse | undefined
  isAffectedSetupRowsLoading: boolean
}

export const FormulaInspector: React.FC<IProps> = ({
  hasAppliesToChanged,
  selectedFormula,
  handleNewMappingSubmit,
  handleMappingDelete,
  metadata,
  onSelectQuoteRow,
  canWrite,
  affectedSetups,
  isAffectedSetupRowsLoading,
}) => {
  const affectedQuotesGridRef = useRef(null)

  const clearAffectedQuotesSelection = useCallback(
    () => affectedQuotesGridRef?.current?.forEachNode((n) => n.setSelected(false)),
    []
  )
  const handleTabChange = () => {
    clearAffectedQuotesSelection()
    onSelectQuoteRow(null)
  }

  return (
    <Tabs
      onChange={handleTabChange}
      defaultActiveKey='1'
      tabBarStyle={{ backgroundColor: 'var(--bg-1)', borderTop: '2px solid var(--gray-200)' }}
    >
      <Tabs.TabPane tab={<span>Applies To</span>} key='1'>
        <AppliesToTab
          metadata={metadata}
          selectedFormula={selectedFormula}
          onSubmit={handleNewMappingSubmit}
          onDelete={handleMappingDelete}
          canWrite={canWrite}
        />
      </Tabs.TabPane>
      <Tabs.TabPane
        disabled={hasAppliesToChanged}
        tab={
          <span>
            {hasAppliesToChanged ? 'Save Formula to View Quote Rows' : 'Quote Rows'}

            {!hasAppliesToChanged && (
              <>
                {isAffectedSetupRowsLoading ? (
                  <Spin size='small' indicator={<LoadingOutlined />} />
                ) : (
                  ` (${affectedSetups?.Data?.length})`
                )}
              </>
            )}
          </span>
        }
        key='2'
      >
        <AffectedQuotesTab
          gridRef={affectedQuotesGridRef}
          affectedQuoteRows={affectedSetups}
          isAffectedQuoteRowsLoading={isAffectedSetupRowsLoading}
          onSelectQuoteRow={onSelectQuoteRow}
        />
      </Tabs.TabPane>
    </Tabs>
  )
}
