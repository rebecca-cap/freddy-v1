import { ReloadOutlined } from '@ant-design/icons'
import { GridViewsFooter } from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/GridViewsFooter'
import { GridViewsRow } from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/GridViewsRow'
import {
  GridRef,
  GridView,
  GridViewManager,
  ViewPayload,
} from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/schema.types'
import React, { useState } from 'react'

import { GraviButton, Horizontal, Vertical } from '@/components'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export type ConfigurableGridViewsProps = {
  onGridReset: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
  gridViewManager: GridViewManager
  width: number
  gridRef: GridRef
  storageKey: string
  setGridConfig: React.Dispatch<React.SetStateAction<any>>
}
export function ConfigurableGridViews({
  onGridReset,
  gridViewManager,
  width,
  gridRef,
  storageKey,
  setGridConfig,
}: ConfigurableGridViewsProps) {
  const { value: gridViews, setValue: setGridViews } = useLocalStorage<
    GridView[]
  >(`gridViewList::${storageKey}`, [])

  const [isLoading, setIsLoading] = useState(false)
  const [selectedView, setSelectedView] = useState<string | number | null>(null)
  const [showForm, setShowForm] = useState<string | number | null>('')

  async function saveView(view: ViewPayload, onClose?: () => void) {
    setIsLoading(true)
    const newViews = await gridViewManager.saveView(view)
    setGridViews(newViews)
    if (onClose && typeof onClose !== 'undefined') {
      onClose()
    }
    setIsLoading(false)
    if (view.id) {
      setSelectedView(view.id)
    } else {
      const saved = newViews.find((v) => v.name === view.name)
      if (saved) setSelectedView(saved.id)
    }
  }

  function handleGridReset(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    onGridReset(e)
    setSelectedView(null)
  }

  return (
    <Vertical style={{ width }}>
      <Horizontal
        verticalCenter
        className='px-3 py-2 border-bottom'
        style={{ width, minHeight: 40 }}
      >
        <GraviButton
          className='ghost-gravi-button'
          onClick={handleGridReset}
          buttonText='Reset To Default'
          icon={<ReloadOutlined />}
        />
      </Horizontal>
      {/* scroll container */}
      <div style={{ height: '100%', overflowY: 'auto', width }}>
        {gridViews &&
          gridViews?.length > 0 &&
          gridViews.map((view) => (
            <GridViewsRow
              key={view.id}
              view={view}
              saveView={saveView}
              width={width}
              selectedView={selectedView}
              gridRef={gridRef}
              gridViewManager={gridViewManager}
              setSelectedView={setSelectedView}
              gridViews={gridViews}
              setGridViews={setGridViews}
              showForm={showForm}
              setShowForm={setShowForm}
              isLoading={isLoading}
              setGridConfig={setGridConfig}
            />
          ))}
      </div>
      <GridViewsFooter
        gridViewManager={gridViewManager}
        gridRef={gridRef}
        saveView={saveView}
        width={width}
        showForm={showForm}
        setShowForm={setShowForm}
        gridViews={gridViews}
        isLoading={isLoading}
      />
    </Vertical>
  )
}
