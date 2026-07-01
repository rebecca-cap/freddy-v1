import { EllipsisOutlined } from '@ant-design/icons'
import { GridViewsActionButtons } from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/GridViewsActionButtons'
import { GridViewsEditNameView } from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/GridViewsEditNameView'
import {
  GridRef,
  GridView,
  GridViewManager,
  ViewPayload,
} from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/schema.types'
import { applyView } from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/ConfigurableGridViewsEvents'
import { GridConfigState } from '@components/GraviGrid/hooks/useAGGridEvent'
import { Button, Dropdown, Tooltip } from 'antd'
import React from 'react'

import { GraviButton, Horizontal, Texto } from '@/components'

export interface GridViewsRowProps {
  view: GridView
  width: number
  saveView: (view: ViewPayload, onClose?: () => void) => void
  selectedView: string | number | null
  gridRef: GridRef
  setSelectedView: React.Dispatch<React.SetStateAction<string | number | null>>
  gridViews: GridView[] | null
  setGridViews: React.Dispatch<React.SetStateAction<GridView[] | null>>
  gridViewManager: GridViewManager
  showForm: string | number | null
  setShowForm: React.Dispatch<React.SetStateAction<string | number | null>>
  isLoading: boolean
  setGridConfig: React.Dispatch<React.SetStateAction<GridConfigState | null>>
}
export function GridViewsRow({
  view,
  width,
  saveView,
  selectedView,
  gridRef,
  setSelectedView,
  gridViews,
  setGridViews,
  gridViewManager,
  showForm,
  setShowForm,
  isLoading,
  setGridConfig,
}: GridViewsRowProps) {
  return showForm === view.id ? (
    <GridViewsEditNameView
      setShowForm={setShowForm}
      width={width}
      view={view}
      saveView={saveView}
      gridRef={gridRef}
      gridViews={gridViews}
      isLoading={isLoading}
    />
  ) : (
    <Horizontal
      verticalCenter
      style={{ width }}
      justifyContent='space-between'
      className='px-3 py-2 border-bottom'
    >
      <Horizontal flex={1}>
        <Tooltip
          title={view.name.length > 40 ? view.name : ''}
          placement='topLeft'
        >
          <GraviButton
            block
            className='ghost-gravi-button p-0'
            onClick={() =>
              applyView(view, gridRef, setSelectedView, setGridConfig)
            }
            buttonText={
              <Texto
                className='text-truncate'
                style={{
                  width: '100%',
                  color: selectedView === view.id ? 'var(--theme-color-4)' : '',
                }}
              >
                {view.name}
              </Texto>
            }
          />
        </Tooltip>
      </Horizontal>
      <Horizontal flex={0.2} justifyContent='flex-end'>
        <Dropdown
          placement='top'
          trigger={['click']}
          overlay={
            <GridViewsActionButtons
              gridViewManager={gridViewManager}
              view={view}
              saveView={saveView}
              setGridViews={setGridViews}
              gridRef={gridRef}
              setEditingView={setShowForm}
            />
          }
        >
          <GraviButton
            className='ghost-gravi-button'
            icon={<EllipsisOutlined />}
          />
        </Dropdown>
      </Horizontal>
    </Horizontal>
  )
}
