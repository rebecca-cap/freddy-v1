import { FormulaEditor } from '@components/shared/Formulas/FormulaEditor'
import { FormulaHeaderSaveConfirm } from '@components/shared/Formulas/FormulaHeaderSaveConfirm'
import { FormulaNameInput } from '@components/shared/Formulas/FormulaNameInput'
import { FormulaStatus } from '@components/shared/Formulas/FormulaStatus'
import { FormulaValue } from '@components/shared/Formulas/helpers'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { useNavigationBlock } from '@hooks/useNavigationBlock'
import { PriceEngineFormulaVariablesGrid } from '@modules/Admin/ManagePriceEngineFormulas/components/Grid'
import { Select, Tooltip } from 'antd'
import React from 'react'

import { FormulaInspector } from './components/FormulaInspector'
import { FormulaSideMenu } from './components/FormulaSideMenu'
import { ProductLocationModal } from './components/ProductLocationModal'
import { VariableConfigurationModal } from './components/VariableConfigurationModal'
import { useManagedFormula } from './hooks/useManagedFormula'

export function ManageFormulasPage() {
  const formulaApi = useManagedFormula()

  useNavigationBlock({
    blockCondition: formulaApi?.formulaStatus !== 'unchanged',
    modalTitle: 'Formula has been edited.',
    modalContent: 'If you leave this page, your changes will be lost. Are you sure?',
  })

  return (
    <>
      <VariableConfigurationModal
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

      <Horizontal style={{ height: '100%', gap: '1rem' }}>
        <FormulaSideMenu
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
          <Horizontal
            justifyContent='flex-start'
            alignItems='center'
            className='bg-1 p-3'
            style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, gap: '4rem' }}
          >
            <div>
              <Texto> Formula </Texto>
              <Horizontal style={{ gap: '2rem' }} alignItems='center'>
                <div style={formulaApi.isEditingName ? null : { display: 'none' }}>
                  <FormulaNameInput
                    isFormulaEditorFocused={formulaApi.isFormulaEditorFocused}
                    isQuickSearchFocused={formulaApi.isQuickSearchFocused}
                    value={formulaApi.selectedFormula?.Name}
                    onChange={formulaApi.handleFormulaNameChange}
                    onFinish={() => formulaApi.dispatch({ type: 'SET_IS_EDITING_NAME', payload: false })}
                  />
                </div>
                {!formulaApi.isEditingName && (
                  <Tooltip title={formulaApi?.canWrite ? 'Edit Formula Name' : ''} placement='bottomLeft'>
                    <div
                      onClick={() => {
                        if (formulaApi.canWrite) {
                          formulaApi.dispatch({ type: 'SET_IS_EDITING_NAME', payload: true })
                          formulaApi.formulaNameInputRef?.current?.focus()
                        }
                      }}
                      style={{ minWidth: 400 }}
                    >
                      <Texto
                        category='h5'
                        style={{
                          minWidth: 400,
                          maxWidth: 600,
                          cursor: formulaApi.canWrite ? 'pointer' : undefined,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formulaApi?.selectedFormula?.Name}
                      </Texto>
                    </div>
                  </Tooltip>
                )}

                <Select
                  placeholder='Formula Marker'
                  style={{ maxWidth: 260, width: 260 }}
                  value={formulaApi?.selectedMarker?.Value}
                  onChange={formulaApi.handleFormulaMarkerChange}
                  disabled={!formulaApi.canWrite}
                >
                  {formulaApi?.metadata?.Markers.map((m) => (
                    <Select.Option value={m.Value} key={m.Value}>
                      {m.Text}
                    </Select.Option>
                  ))}
                </Select>
              </Horizontal>
            </div>
            <FormulaStatus status={formulaApi?.formulaStatus} isLoading={formulaApi.isFormulaBeingValidated} />
            <FormulaHeaderSaveConfirm formulaApi={formulaApi} />
          </Horizontal>
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
                isLoading={formulaApi.isQuoteValueLoading}
                isDraft={formulaApi.isDraft}
              />
              <Vertical>
                <PriceEngineFormulaVariablesGrid formulaApi={formulaApi} />
              </Vertical>
            </Vertical>
            <Horizontal flex={0.25} fullHeight>
              <FormulaInspector
                hasAppliesToChanged={formulaApi?.hasAppliesToChanged}
                metadata={formulaApi?.metadata}
                selectedFormula={formulaApi?.selectedFormula}
                handleNewMappingSubmit={formulaApi?.handleNewFormulaMapping}
                handleMappingDelete={formulaApi.handleFormulaMappingDelete}
                onSelectQuoteRow={formulaApi.handleSelectQuoteRow}
                canWrite={formulaApi.canWrite}
                affectedSetups={formulaApi.affectedSetups}
                isAffectedSetupRowsLoading={formulaApi.isAffectedSetupRowsLoading}
              />
            </Horizontal>
          </Horizontal>
        </Vertical>
      </Horizontal>
    </>
  )
}
