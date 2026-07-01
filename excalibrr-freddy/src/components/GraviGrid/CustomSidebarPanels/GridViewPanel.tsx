import { GridViewManager } from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/schema.types'
import { ConfigurableGridViews } from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/ConfigurableGridViews'
import { GridConfigState } from '@components/GraviGrid/hooks/useAGGridEvent'
import { AgGridReact } from 'ag-grid-react'
import React from 'react'

import { GraviButton } from '../../Controls/Buttons/GraviButton'
import { Horizontal } from '../../Layout/Horizontal'

type GridViewPanelProps = {
  onGridReset: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  gridViewManager?: GridViewManager
  width: number
  gridRef: React.MutableRefObject<AgGridReact | null>
  storageKey: string
  setGridConfig: React.Dispatch<React.SetStateAction<GridConfigState>>
}

export const GridViewPanel: React.FC<GridViewPanelProps> = ({
  onGridReset,
  gridViewManager,
  width,
  gridRef,
  storageKey,
  setGridConfig,
}) => {
  if (!gridViewManager) {
    return (
      <Horizontal
        verticalCenter
        horizontalCenter
        style={{ width: 250, paddingTop: '1em' }}
      >
        <GraviButton
          danger
          onClick={onGridReset}
          buttonText='Reset To Default'
        />
      </Horizontal>
    )
  }

  return (
    <ConfigurableGridViews
      onGridReset={onGridReset}
      gridViewManager={gridViewManager}
      width={width}
      gridRef={gridRef}
      storageKey={storageKey}
      setGridConfig={setGridConfig}
    />
  )
}
