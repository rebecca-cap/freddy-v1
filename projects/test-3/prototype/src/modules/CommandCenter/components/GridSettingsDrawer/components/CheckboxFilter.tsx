import { MetadataListResponseItem } from '@api/globalTypes'
import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { TreeResponseData } from '@modules/CommandCenter/api/types.schema'
import { Checkbox, Divider, Form, Tree } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { DataNode } from 'antd/lib/tree'
import { useMemo } from 'react'

export interface CheckboxFilterProps {
  sectionTitle: string
  formItemName: string
  checkedKeys: string[]
  setCheckedKeys: React.Dispatch<React.SetStateAction<string[]>>
  options?: TreeResponseData[] | MetadataListResponseItem[]
}

export function CheckboxFilter({
  sectionTitle,
  formItemName,
  checkedKeys,
  setCheckedKeys,
  options,
}: CheckboxFilterProps) {
  function transformTreeToDataNodeTyped(backendTrees: TreeResponseData[] | MetadataListResponseItem[]): DataNode[] {
    return backendTrees.map((tree) => ({
      key: tree.Value,
      title: tree.Text,
      children: tree.Children && tree.Children.length > 0 ? transformTreeToDataNodeTyped(tree.Children) : undefined,
    }))
  }

  const getAllChildKeys = (parentKey: string, dataNodes: DataNode[]): string[] => {
    const findNode = (nodes: DataNode[], key: string): DataNode | null => {
      for (const node of nodes) {
        if (node.key === key) return node
        if (node.children) {
          const found = findNode(node.children, key)
          if (found) return found
        }
      }
      return null
    }

    const getChildKeysRecursive = (node: DataNode): string[] => {
      if (!node.children) return []
      const childKeys: string[] = []
      for (const child of node.children) {
        childKeys.push(child.key as string)
        childKeys.push(...getChildKeysRecursive(child))
      }
      return childKeys
    }
    const parentNode = findNode(dataNodes, parentKey)
    return parentNode ? getChildKeysRecursive(parentNode) : []
  }

  const areAllChildrenSelected = (parentKey: string, dataNodes: DataNode[], checkedKeys: string[]): boolean => {
    const childKeys = getAllChildKeys(parentKey, dataNodes)
    return childKeys.length > 0 && childKeys.every((childKey) => checkedKeys.includes(childKey))
  }

  const onCheck = (
    checkedKeysValue: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] },
    e: { checked: boolean; checkedNodes: any; node: any; event: any; halfCheckedKeys?: any }
  ) => {
    if (sectionTitle === 'Quote Configurations') {
      setCheckedKeys(e.checkedNodes.map((node: any) => node.key.toString()))
      return
    }
    const { node, checked } = e
    const nodeKey = node.key as string

    let currentCheckedKeys: string[]
    if (Array.isArray(checkedKeysValue)) {
      currentCheckedKeys = checkedKeysValue.map((key) => key.toString())
    } else {
      currentCheckedKeys = checkedKeysValue.checked.map((key) => key.toString())
    }
    let newCheckedKeys = [...currentCheckedKeys]

    if (checked) {
      const childKeys = getAllChildKeys(nodeKey, antTreeData)
      newCheckedKeys = [...new Set([...newCheckedKeys, ...childKeys])]
    } else {
      const childKeys = getAllChildKeys(nodeKey, antTreeData)
      newCheckedKeys = newCheckedKeys.filter((key) => !childKeys.includes(key))
    }

    const updatedKeys = [...newCheckedKeys]
    antTreeData.forEach((parentNode) => {
      const parentKey = parentNode.key as string
      if (areAllChildrenSelected(parentKey, antTreeData, updatedKeys)) {
        if (!updatedKeys.includes(parentKey)) {
          updatedKeys.push(parentKey)
        }
      } else {
        const index = updatedKeys.indexOf(parentKey)
        if (index > -1) {
          updatedKeys.splice(index, 1)
        }
      }
    })

    setCheckedKeys(updatedKeys)
  }

  function getKeysFromDataNode(dataNodes: DataNode[]): string[] {
    return dataNodes.flatMap((node) => [
      node.key as string,
      ...(node.children ? getKeysFromDataNode(node.children) : []),
    ])
  }

  const antTreeData = useMemo(() => transformTreeToDataNodeTyped(options || []), [options])
  const allKeys = useMemo(() => getKeysFromDataNode(antTreeData), [antTreeData])

  const onCheckAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setCheckedKeys(allKeys)
    } else {
      setCheckedKeys([])
    }
  }

  const allChecked = useMemo(() => {
    return allKeys.every((key) => checkedKeys.includes(key))
  }, [allKeys, checkedKeys])

  const findNodeRecursively = (nodes: DataNode[], targetKey: string): DataNode | null => {
    for (const node of nodes) {
      if (node.key === targetKey) return node
      if (node.children) {
        const found = findNodeRecursively(node.children, targetKey)
        if (found) return found
      }
    }
    return null
  }

  const checkedKeysForTree = useMemo(() => {
    //  remove:
    //  A. parent keys that are checked but do not have all children checked, have to check deeply nested children
    //  B. not present in allKeys
    return checkedKeys.filter((key) => {
      if (!allKeys.includes(key)) return false
      const node = findNodeRecursively(antTreeData, key)
      if (node && node.children && node.children.length > 0) {
        return areAllChildrenSelected(key, antTreeData, checkedKeys)
      }
      return true
    })
  }, [checkedKeys, options, antTreeData, allKeys])

  return (
    <Vertical className='my-2'>
      <Texto category='h6' className='mb-2'>
        {sectionTitle}
      </Texto>
      <Vertical className='bordered p-2 border-radius-5'>
        <>
          <Checkbox style={{ marginLeft: '24px' }} onChange={onCheckAll} checked={allChecked}>
            Check All
          </Checkbox>
          <Divider className='my-2' />
        </>

        <Form.Item name={formItemName} noStyle>
          <Tree
            checkable
            onCheck={onCheck}
            checkedKeys={checkedKeysForTree}
            treeData={antTreeData}
            defaultExpandAll
            height={300}
          />
        </Form.Item>
      </Vertical>
    </Vertical>
  )
}
