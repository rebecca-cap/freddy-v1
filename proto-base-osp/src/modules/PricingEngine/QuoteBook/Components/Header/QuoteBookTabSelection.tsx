import { Texto } from '@gravitate-js/excalibrr'
import { getOrderedGroups, reorderList } from '@modules/PricingEngine/QuoteBook/utils/tabUtils'
import classNames from 'classnames'
import React, { useMemo, useRef } from 'react'

interface QuoteBookTabSelectionProps {
  metadata: any
  selectedGroupTabs: string[]
  handleTabSelect: (tabKey: string) => void
  tabOrder: string[]
  setTabOrder: (order: string[]) => void
}

export function QuoteBookTabSelection({
  metadata,
  selectedGroupTabs,
  handleTabSelect,
  tabOrder,
  setTabOrder,
}: QuoteBookTabSelectionProps) {
  const dragItem = useRef<string | null>(null)
  const dragOverItem = useRef<string | null>(null)

  const orderedGroups = useMemo(
    () => getOrderedGroups(metadata?.QuoteMappingGroups, tabOrder),
    [metadata?.QuoteMappingGroups, tabOrder]
  )

  const handleDragStart = (groupId: string) => {
    dragItem.current = groupId
  }

  const handleDragOver = (e: React.DragEvent, groupId: string) => {
    e.preventDefault()
    dragOverItem.current = groupId
  }

  const handleDrop = () => {
    if (!dragItem.current || !dragOverItem.current || dragItem.current === dragOverItem.current) return

    const currentOrder = orderedGroups.map((g) => String(g.QuoteConfigurationMappingGroupId))
    const newOrder = reorderList(currentOrder, dragItem.current, dragOverItem.current)

    setTabOrder(newOrder)
    dragItem.current = null
    dragOverItem.current = null
  }

  if (!metadata?.QuoteMappingGroups) return null

  return (
    <>
      {orderedGroups.map((group) => {
        const groupId = String(group.QuoteConfigurationMappingGroupId)
        const isSelected = selectedGroupTabs?.includes(groupId)
        return (
          <div
            key={groupId}
            draggable
            onDragStart={() => handleDragStart(groupId)}
            onDragOver={(e) => handleDragOver(e, groupId)}
            onDrop={handleDrop}
            onClick={() => handleTabSelect(groupId)}
            className={classNames('quoteBook-tab p-3', {
              'bg-theme1': isSelected,
              'bg-1': !isSelected,
            })}
          >
            <Texto weight='bold' appearance={isSelected ? 'white' : 'default'}>
              {group.GroupName}
            </Texto>
          </div>
        )
      })}
    </>
  )
}
