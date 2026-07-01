import LivePriceActiveIcon from '@assets/icons/LivePriceActive'
import LivePriceInactiveIcon from '@assets/icons/LivePriceInactive'
import { GraviGrid, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Modal, Switch } from 'antd'
import _ from 'lodash'
import React, { useMemo } from 'react'

export function LivePrice({ formulaApi }) {
  const LivePriceData = useMemo(() => {
    if (formulaApi?.selectedFormula?.LivePrice) {
      const livePriceCopy = _.cloneDeep(formulaApi.selectedFormula?.LivePrice)

      return [{ ...livePriceCopy }]
    }
    return []
  }, [formulaApi.selectedFormula?.LivePrice])

  const handleSwitchChange = (checked: boolean, event) => {
    event.stopPropagation()
    if (checked) {
      formulaApi.setLivePriceToggle(true)
      formulaApi?.dispatch({
        type: 'ADD_LIVE_VARIABLE',
        payload: {},
        metadata: formulaApi.metadata!,
      })
    } else {
      Modal.confirm({
        title: 'Are you sure you want to remove the Live Price variable?',
        content: 'This action will remove the live price variable from the formula.',
        onOk: () => {
          formulaApi.setLivePriceToggle(false) // Change state only after confirmation
          formulaApi?.dispatch({
            type: 'REMOVE_LIVE_VARIABLE',
            payload: {},
            metadata: formulaApi.metadata!,
          })
        },
        onCancel: () => {
          formulaApi.setLivePriceToggle(true) // Revert the switch back to true if canceled
        },
      })
    }
  }

  return (
    <Vertical height='auto'>
      <Horizontal
        className='px-4 py-2'
        justifyContent='space-between'
        height={50}
        border='all'
        verticalCenter
        style={{ border: '1px solid var(--gray-300)' }}
      >
        <Horizontal style={{ gap: 10 }} verticalCenter>
          {formulaApi.livePriceToggle && <LivePriceActiveIcon />}
          {!formulaApi.livePriceToggle && <LivePriceInactiveIcon />}
          <Texto category='p2' weight='bolder'>
            Live Price
          </Texto>
          <Switch onClick={handleSwitchChange} checked={formulaApi.livePriceToggle} disabled={!formulaApi.canWrite} />
        </Horizontal>
      </Horizontal>
      {formulaApi.livePriceToggle && (
        <div style={{ height: 89 }}>
          <GraviGrid
            updateEP={formulaApi?.canWrite ? formulaApi?.handleLiveVariableChange : undefined}
            agPropOverrides={{
              suppressDragLeaveHidesColumns: true,
              suppressMovableColumns: true,
              rowGroupPanelShow: 'never',
              domLayout: 'normal',
              rowHeight: 40,
              headerHeight: 30,
              overlayNoRowsTemplate: `<div />`,
              getRowId: (row) => row?.data?.FormulaVariableId,
            }}
            columnDefs={formulaApi.livePriceColumnDefs}
            sideBar={false}
            rowData={LivePriceData}
          />
        </div>
      )}
    </Vertical>
  )
}
