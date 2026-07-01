import './index.css'

import { LoadingOutlined } from '@ant-design/icons'
import {
  MarketPlatformFormulaAffectedSetupsResponse,
  MarketPlatformFormulaMetadata,
  MarketPlatformFormulasResponse,
} from '@api/useMarketPlatformFormulas/types'
import { Horizontal } from '@gravitate-js/excalibrr'
import { Spin, Tabs } from 'antd'
import React, { useCallback, useRef } from 'react'

import { NewMappingForm } from '../NewMappingForm'
import { AffectedSetupsTab, MarketPlatformSetup } from './components/AffectedSetupsTab'
import { AppliesToTab } from './components/AppliesToTab'

interface IProps {
  hasAppliesToChanged: boolean
  selectedFormula: MarketPlatformFormulasResponse['Data'][number]
  handleNewMappingSubmit: typeof NewMappingForm.defaultProps.onSubmit
  onHandleMappingDelete: (
    id: MarketPlatformFormulasResponse['Data'][number]['AppliesTo'][number]['FormulaReferenceDataMappingId']
  ) => void
  metadata: MarketPlatformFormulaMetadata
  onSelectMarketPlatformSetupRow?: (_selectedRow: MarketPlatformSetup) => void
  canWrite: boolean
  affectedSetups: MarketPlatformFormulaAffectedSetupsResponse | undefined
  isAffectedSetupRowsLoading: boolean
}

export const FormulaInspector: React.FC<IProps> = ({
  hasAppliesToChanged,
  selectedFormula,
  handleNewMappingSubmit,
  onHandleMappingDelete,
  metadata,
  onSelectMarketPlatformSetupRow,
  canWrite,
  affectedSetups,
  isAffectedSetupRowsLoading,
}) => {
  const affectedSetupsGridRef = useRef(null)

  const clearAffectedQuotesSelection = useCallback(
    () => affectedSetupsGridRef?.current?.forEachNode((n) => n.setSelected(false)),
    []
  )
  const handleTabChange = () => {
    clearAffectedQuotesSelection()
    if (onSelectMarketPlatformSetupRow) onSelectMarketPlatformSetupRow(null)
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
          onDelete={onHandleMappingDelete}
          canWrite={canWrite}
        />
      </Tabs.TabPane>
      <Tabs.TabPane
        disabled={hasAppliesToChanged}
        tab={
          <Horizontal style={{ display: 'flex', gap: 10 }} verticalCenter>
            {hasAppliesToChanged ? 'Save Formula to View Setups' : 'Market Platform Setups'}

            {!hasAppliesToChanged && (
              <div>
                {isAffectedSetupRowsLoading ? (
                  <Spin size='small' indicator={<LoadingOutlined />} />
                ) : (
                  ` (${affectedSetups?.Data?.length})`
                )}
              </div>
            )}
          </Horizontal>
        }
        key='2'
      >
        <AffectedSetupsTab
          gridRef={affectedSetupsGridRef}
          affectedSetups={affectedSetups}
          isAffectedSetupRowsLoading={isAffectedSetupRowsLoading}
          onSelectMarketPlatformSetupRow={onSelectMarketPlatformSetupRow}
        />
      </Tabs.TabPane>
    </Tabs>
  )
}
