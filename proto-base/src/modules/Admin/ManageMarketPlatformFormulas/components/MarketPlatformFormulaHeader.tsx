import { FormulaHeaderSaveConfirm } from '@components/shared/Formulas/FormulaHeaderSaveConfirm'
import { FormulaNameInput } from '@components/shared/Formulas/FormulaNameInput'
import { FormulaStatus } from '@components/shared/Formulas/FormulaStatus'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Select, Tooltip } from 'antd'
import React from 'react'

export function MarketPlatformFormulaHeader({ formulaApi }) {
  return (
    <Horizontal
      justifyContent='space-between'
      verticalCenter
      alignItems='center'
      className='bg-1 p-3'
      style={{
        borderTopLeftRadius: 10,
        borderTopRightRadius: 5,
        gap: '1rem',
        maxWidth: '100%',
      }}
    >
      <Vertical flex={1} style={{ minWidth: 300 }}>
        <Texto>Formula</Texto>
        <Horizontal style={{ gap: '2rem' }} alignItems='center' verticalCenter height='auto'>
          {formulaApi.isEditingName && (
            <div>
              <FormulaNameInput
                isFormulaEditorFocused={formulaApi.isFormulaEditorFocused}
                isQuickSearchFocused={formulaApi.isQuickSearchFocused}
                value={formulaApi.selectedFormula?.Name}
                onChange={formulaApi.handleFormulaNameChange}
                onFinish={() => formulaApi.dispatch({ type: 'SET_IS_EDITING_NAME', payload: false })}
              />
            </div>
          )}
          {!formulaApi.isEditingName && (
            <Tooltip title={formulaApi?.canWrite ? 'Edit Formula Name' : ''} placement='bottomLeft'>
              <Horizontal
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
                  {formulaApi?.selectedFormula?.Name || 'New Formula'}
                </Texto>
              </Horizontal>
            </Tooltip>
          )}
        </Horizontal>
      </Vertical>
      <Vertical flex={1} style={{ minWidth: 260 }} height='auto'>
        <Texto>Marker</Texto>
        <Select
          placeholder='Formula Marker'
          style={{ minWidth: 260 }}
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
      </Vertical>
      <Vertical flex={1}>
        <FormulaStatus status={formulaApi?.formulaStatus} isLoading={formulaApi.isFormulaBeingValidated} />
      </Vertical>
      <Vertical flex={2}>
        <FormulaHeaderSaveConfirm formulaApi={formulaApi} />
      </Vertical>
    </Horizontal>
  )
}
