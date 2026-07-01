import { HierarchyListItem } from '@components/shared/Hierarchies/types'
import { Texto } from '@gravitate-js/excalibrr'
import React from 'react'

interface DisplayTextProps {
  hierarchyItem: HierarchyListItem
}

export function DisplayText({ hierarchyItem }: DisplayTextProps) {
  return <Texto category='h6'>{hierarchyItem.Name}</Texto>
}
