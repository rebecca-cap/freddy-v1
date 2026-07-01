import { PlusOutlined } from '@ant-design/icons'
import { GridViewsEditNameView } from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/GridViewsEditNameView'
import {
  GridView,
  GridViewManager,
  ViewPayload,
} from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/schema.types'
import { AgGridReact } from 'ag-grid-react'
import React from 'react'

import { GraviButton, Horizontal } from '@/components'

export interface GridViewsFooterProps {
  saveView: (view: ViewPayload, onClose?: () => void) => void
  width: number
  gridRef: React.MutableRefObject<AgGridReact | null>
  gridViewManager: GridViewManager
  setShowForm: React.Dispatch<React.SetStateAction<string | number | null>>
  showForm: string | number | null
  gridViews: GridView[] | null
  isLoading: boolean
}
export function GridViewsFooter({
  saveView,
  width,
  gridRef,
  gridViewManager,
  showForm,
  setShowForm,
  gridViews,
  isLoading,
}: GridViewsFooterProps) {
  if (typeof gridViewManager.saveView === 'undefined') {
    return null
  }
  return showForm === 'new' ? (
    <GridViewsEditNameView
      setShowForm={setShowForm}
      width={width}
      view={{ id: '', name: '' }}
      saveView={saveView}
      gridRef={gridRef}
      isFooter
      gridViews={gridViews}
      isLoading={isLoading}
    />
  ) : (
    <Horizontal
      verticalCenter
      style={{ width, minHeight: 40 }}
      className='px-3 py-2 border-top mb-2'
    >
      <GraviButton
        className='ghost-gravi-button'
        onClick={() => setShowForm('new')}
        buttonText='New View'
        icon={<PlusOutlined />}
      />
    </Horizontal>
  )
}
