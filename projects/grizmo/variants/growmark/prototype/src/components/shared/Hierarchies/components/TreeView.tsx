import '../styles.css'

import { TreeContextMenu } from '@components/shared/Hierarchies/components/TreeContextMenu'
import { sortTree } from '@components/shared/Hierarchies/helpers'
import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import { deepCopy } from '@utils/index'
import { Dropdown, Input, Tree } from 'antd'
import React, { useMemo, useState } from 'react'

function filterTree(treeData, filterString) {
  function fuzzyMatch(str, filter) {
    return str.toLowerCase().includes(filter.toLowerCase())
  }
  function filterNode(node) {
    if (node.children && node.children.length > 0) {
      node.children = node.children.filter(filterNode)
      return true
    }

    return fuzzyMatch(node.title, filterString)
  }

  return treeData.filter(filterNode)
}

export function TreeView({ title, onMove, onSelect, data, canWrite }) {
  const [hierarchyFilter, setHierarchyFilter] = React.useState('')
  const [contextMenuInfo, setContextMenuInfo] = useState<{
    visible: boolean
    x: number
    y: number
    node?: any
  }>({ visible: false, x: 0, y: 0 })

  const [expandedKeys, setExpandedKeys] = useState<(string | number)[]>([])
  const [autoExpandParent, setAutoExpandParent] = useState(true)

  const treeData = useMemo(() => {
    const cloned = deepCopy(data) || []
    const sorted = sortTree(cloned)
    return filterTree(sorted, hierarchyFilter)
  }, [hierarchyFilter, data])

  const handleDrop = (info: any) => {
    const itemToMove = info.dragNode.key
    let target = info.node.key
    if (info.dropPosition === -1) {
      target = 0
    }
    onMove({ KeysToMove: [itemToMove], TargetKey: target })
  }

  const handleSelect = (selectedKeys: React.Key[], info: any) => {
    const firstKey = selectedKeys.length > 0 ? Number(selectedKeys[0]) : null
    onSelect(firstKey)
  }

  const handleRightClick = (info: any) => {
    setContextMenuInfo({
      visible: true,
      x: info.event.pageX,
      y: info.event.pageY,
      node: info.node,
    })
  }

  const hideMenu = () => setContextMenuInfo({ ...contextMenuInfo, visible: false })

  const getAllKeys = (nodes: any[]): (string | number)[] =>
    nodes.reduce(
      (acc, node) => [...acc, node.key as string | number, ...(node.children ? getAllKeys(node.children) : [])],
      [] as (string | number)[]
    )

  const expandAll = () => {
    setExpandedKeys(getAllKeys(treeData))
    setAutoExpandParent(false)
    hideMenu()
  }

  const collapseAll = () => {
    setExpandedKeys([])
    setAutoExpandParent(false)
    hideMenu()
  }

  const expandNode = () => {
    if (contextMenuInfo.node) {
      const key = contextMenuInfo.node.key as string | number
      if (!expandedKeys.includes(key)) {
        setExpandedKeys([...expandedKeys, key])
      }
    }
    hideMenu()
  }

  const collapseNode = () => {
    if (contextMenuInfo.node) {
      const key = contextMenuInfo.node.key as string | number
      setExpandedKeys(expandedKeys.filter((k) => k !== key))
    }
    hideMenu()
  }

  const menu = (
    <TreeContextMenu
      expandAll={expandAll}
      collapseAll={collapseAll}
      expandNode={expandNode}
      collapseNode={collapseNode}
    />
  )

  return (
    <div className='bg-2 bordered'>
      <Horizontal alignItems='center'>
        <Texto category='h3' className='p-2 border-bottom'>
          {title}
        </Texto>
        <div className={'pr-4'} style={{ width: '100%' }}>
          <Input
            value={hierarchyFilter}
            placeholder={`Search ${title?.toLowerCase()}`}
            onChange={(e) => setHierarchyFilter(e.target.value)}
            allowClear
          />
        </div>
      </Horizontal>
      <Tree
        className='draggable-tree pt-2'
        draggable
        defaultExpandAll
        onDrop={handleDrop}
        treeData={treeData}
        onSelect={handleSelect}
        disabled={!canWrite}
        onRightClick={handleRightClick}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onExpand={(keys) => setExpandedKeys(keys)}
      />
      <div
        style={{
          position: 'absolute',
          top: contextMenuInfo.y,
          left: contextMenuInfo.x,
          zIndex: 1000,
        }}
      >
        <Dropdown
          visible={contextMenuInfo.visible}
          onVisibleChange={(open) => {
            if (!open) hideMenu()
          }}
          overlay={menu}
          trigger={['contextMenu']}
        >
          <div style={{ width: 1, height: 1 }} />
        </Dropdown>
      </div>
    </div>
  )
}
