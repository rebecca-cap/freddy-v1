import {
  DeleteOutlined,
  EditOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import {
  GridView,
  GridViewManager,
  ViewPayload,
} from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/components/schema.types'
import {
  handleDeleteView,
  saveNewViewState,
} from '@components/GraviGrid/CustomSidebarPanels/ConfigurableGridViews/ConfigurableGridViewsEvents'
import { AgGridReact } from 'ag-grid-react'
import { Menu, Popconfirm, Tooltip } from 'antd'
import React from 'react'

import { GraviButton, Horizontal, Texto } from '@/components'

export interface GridViewsActionButtonsProps {
  setEditingView: React.Dispatch<React.SetStateAction<string | number | null>>
  view: GridView
  saveView: (view: ViewPayload, onClose?: () => void) => void
  gridRef: React.MutableRefObject<AgGridReact | null>
  gridViewManager: GridViewManager
  setGridViews: React.Dispatch<React.SetStateAction<GridView[] | null>>
}
export function GridViewsActionButtons({
  setEditingView,
  view,
  saveView,
  gridRef,
  gridViewManager,
  setGridViews,
}: GridViewsActionButtonsProps) {
  return (
    <Menu>
      <Horizontal
        className='px-2'
        verticalCenter
        justifyContent='space-between'
      >
        <Tooltip title='Edit view name'>
          <GraviButton
            className='ghost-gravi-button'
            icon={<EditOutlined />}
            onClick={() => {
              setEditingView(view.id)
            }}
          />
        </Tooltip>
        <Tooltip
          title={`Save current view as ${view.name}`}
          placement='topRight'
          className='mr-2'
        >
          <GraviButton
            className='ghost-gravi-button ml-2 mr-2'
            icon={<SaveOutlined />}
            onClick={() => saveNewViewState(saveView, view, gridRef)}
          />
        </Tooltip>
        <Popconfirm
          title={<Texto style={{ minWidth: 250 }}>Delete {view.name}?</Texto>}
          okText='Confirm'
          onConfirm={() =>
            handleDeleteView(view, gridViewManager, setGridViews)
          }
          icon={
            <QuestionCircleOutlined style={{ color: 'var(--theme-error)' }} />
          }
        >
          <Tooltip title='Delete view' placement='topRight' className='mr-2'>
            <GraviButton
              className='ghost-gravi-button'
              icon={<DeleteOutlined style={{ color: 'var(--theme-error)' }} />}
            />
          </Tooltip>
        </Popconfirm>
      </Horizontal>
    </Menu>
  )
}
