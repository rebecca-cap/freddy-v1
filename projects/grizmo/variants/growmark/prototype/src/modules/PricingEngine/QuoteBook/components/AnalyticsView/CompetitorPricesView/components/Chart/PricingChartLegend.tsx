import { Horizontal, Texto } from '@gravitate-js/excalibrr'
import React, { useMemo } from 'react'

interface PricingChartLegendProps {
  categoriesWithShadesDict: { category: string; shade: string }[]
  selectedCompetitor?: string
}
export function PricingChartLegend({ categoriesWithShadesDict, selectedCompetitor }: PricingChartLegendProps) {
  const uniqueCategoriesFilteredBySelectedCompetitor = useMemo(() => {
    if (!categoriesWithShadesDict) return []
    const sortedCategoriesWithShadesDict = categoriesWithShadesDict.sort((a, b) => (a.category > b.category ? 1 : -1))
    if (selectedCompetitor === 'All') {
      return categoriesWithShadesDict
    }
    return sortedCategoriesWithShadesDict.filter(
      (item) => item.category === selectedCompetitor || item.category === 'Selected Row'
    )
  }, [categoriesWithShadesDict, selectedCompetitor])
  return (
    <Horizontal verticalCenter justifyContent='space-evenly' style={{ flexWrap: 'wrap', minHeight: 'fit-content' }}>
      {uniqueCategoriesFilteredBySelectedCompetitor.map(({ category, shade }) => (
        <Horizontal verticalCenter key={category} flex={1} justifyContent='flex-start' style={{ minWidth: '75px' }}>
          <div
            style={{
              backgroundColor: shade,
              height: '15px',
              width: '15px',
              borderRadius: '50%',
              flexShrink: 0,
            }}
            className='mr-2'
          />
          <Texto style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'inherit' }}>
            {category}
          </Texto>
        </Horizontal>
      ))}
    </Horizontal>
  )
}
