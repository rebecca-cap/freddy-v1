import '../styles.css'

import { ExpandAltOutlined, ShrinkOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import React from 'react'

interface TreeContextMenuProps {
  expandAll: () => void
  collapseAll: () => void
  expandNode: () => void
  collapseNode: () => void
}

export const TreeContextMenu: React.FC<TreeContextMenuProps> = ({
  expandAll,
  collapseAll,
  expandNode,
  collapseNode,
}) => {
  return (
    <Menu
      className='tree-context-menu'
      selectable={false}
      items={[
        {
          key: 'expandNode',
          icon: <ExpandAltOutlined />,
          label: 'Expand',
          onClick: expandNode,
        },
        {
          key: 'collapseNode',
          label: 'Collapse',
          onClick: collapseNode,
          icon: <ShrinkOutlined />,
        },
        {
          key: 'expandAll',
          label: 'Expand All',
          onClick: expandAll,
          icon: <span style={{ display: 'inline-block', width: '14px' }} />,
        },
        {
          key: 'collapseAll',
          label: 'Collapse All',
          onClick: collapseAll,
          icon: <span style={{ display: 'inline-block', width: '14px' }} />,
        },
      ]}
    />
  )
}
