import { FormulaEditor } from '@components/shared/Formulas/FormulaEditor'
import { FormulaValue } from '@components/shared/Formulas/helpers'
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { useNavigationBlock } from '@hooks/useNavigationBlock'
import { MarketPlatformFormulaVariablesGrid } from '@modules/Admin/ManageMarketPlatformFormulas/components/Grid'
import { ProductLocationModal } from '@modules/Admin/ManagePriceEngineFormulas/components/ProductLocationModal'
import React from 'react'

import { FormulaInspector } from './components/FormulaInspector'
import { LivePrice } from './components/LivePrice'
import { MarketPlatformFormulaHeader } from './components/MarketPlatformFormulaHeader'
import { MarketPlatformFormulaSideMenu } from './components/MarketPlatformFormulaSideMenu'
import { MarketPlatformVariableConfigurationModal } from './components/VariableConfigurationModal'
import { useMarketPlatformFormula } from './hooks/useMarketPlatformFormula'

export function ManageMarketPlatformFormulasPage() {
  const formulaApi = useMarketPlatformFormula()

  useNavigationBlock({
    blockCondition: formulaApi?.formulaStatus !== 'unchanged' && formulaApi?.formulaStatus !== 'ready',
    modalTitle: 'Formula has been edited.',
    modalContent: 'If you leave this page, your changes will be lost. Are you sure?',
  })

  return (
    <Horizontal style={{ height: '100%' }}>
      <MarketPlatformVariableConfigurationModal
        metadata={formulaApi.metadata}
        selectedVariable={formulaApi.selectedVariable}
        visible={formulaApi.isVariableConfigurationModalVisible}
        onCancel={formulaApi.closeVariableConfigurationModal}
        onSubmit={formulaApi.handleVariableConfigurationChange}
      />
      <ProductLocationModal
        selectedVariable={formulaApi.selectedVariable}
        visible={formulaApi.isProductLocationModalVisible}
        onCancel={formulaApi.closeVariableProductLocationModal}
        onSubmit={formulaApi.handleVariableProductLocationChange}
        metadata={formulaApi.metadata}
      />
      <MarketPlatformFormulaSideMenu
        onNewFormula={formulaApi.handleNewFormula}
        formulas={formulaApi.formulas}
        selectedFormulaId={formulaApi.selectedFormulaId}
        selectedFormula={formulaApi.selectedFormula}
        setIsQuickSearchFocused={formulaApi.setQuickSearchFocus}
        onFormulaClick={formulaApi.handleFormulaClick}
        metadata={formulaApi.metadata}
        canWrite={formulaApi.canWrite}
      />
      <Vertical flex={0.9}>
        <MarketPlatformFormulaHeader formulaApi={formulaApi} />
        <Horizontal fullHeight>
          <Vertical flex={0.85}>
            <FormulaEditor
              value={formulaApi?.selectedFormula?.Formula ?? ''}
              onChange={formulaApi?.handleFormulaValueChange}
              suggestions={formulaApi?.variableSuggestions}
              setIsFormulaEditorFocused={() =>
                formulaApi?.dispatch({ type: 'SET_IS_FORMULA_EDITOR_FOCUSED', payload: true })
              }
              canWrite={formulaApi?.canWrite}
            />
            <FormulaValue
              Value={formulaApi.selectedFormulaValue?.Value}
              PriceStatus={formulaApi.selectedFormulaValue?.PriceStatus}
              IsMissingPrices={formulaApi.selectedFormulaValue?.IsMissingPrices}
              isLoading={formulaApi.isSetupValueLoading}
              isDraft={formulaApi.isDraft}
            />
            <Vertical>
              <LivePrice formulaApi={formulaApi} />
              <MarketPlatformFormulaVariablesGrid formulaApi={formulaApi} />
            </Vertical>
          </Vertical>
          <Horizontal flex={0.3} fullHeight>
            <FormulaInspector
              hasAppliesToChanged={formulaApi?.hasAppliesToChanged}
              metadata={formulaApi?.metadata}
              selectedFormula={formulaApi?.selectedFormula}
              handleNewMappingSubmit={formulaApi?.handleNewFormulaMapping}
              onHandleMappingDelete={formulaApi.handleFormulaMappingDelete}
              onSelectMarketPlatformSetupRow={formulaApi.handleSelectMarketPlatformSetupRow}
              canWrite={formulaApi.canWrite}
              affectedSetups={formulaApi.affectedSetups}
              isAffectedSetupRowsLoading={formulaApi.isAffectedSetupRowsLoading}
            />
          </Horizontal>
        </Horizontal>
      </Vertical>
    </Horizontal>
  )
}
