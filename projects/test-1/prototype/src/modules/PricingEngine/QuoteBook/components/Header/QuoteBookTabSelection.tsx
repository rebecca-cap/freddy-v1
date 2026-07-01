import { Texto } from '@gravitate-js/excalibrr'
import classNames from 'classnames'
import React from 'react'

export function QuoteBookTabSelection({ metadata, selectedGroupTabs, handleTabSelect }) {
  return (
    metadata?.QuoteMappingGroups &&
    [...metadata.QuoteMappingGroups, { QuoteConfigurationMappingGroupId: '-1', GroupName: 'Other' }].map((group) => {
      const isSelected = selectedGroupTabs?.includes(String(group.QuoteConfigurationMappingGroupId))
      return (
        <div
          onClick={() => handleTabSelect(String(group.QuoteConfigurationMappingGroupId))}
          key={group.QuoteConfigurationMappingGroupId}
          className={classNames('quoteBook-tab p-3', {
            'bg-theme1': isSelected,
            'bg-1': !isSelected,
          })}
          style={{
            cursor: 'pointer',
            borderRadius: 6,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            border: '1px solid var(--gray-200)',
            borderBottom: 0,
          }}
        >
          <Texto weight='bold' appearance={isSelected ? 'white' : 'default'}>
            {group.GroupName}
          </Texto>
        </div>
      )
    })
  )
}
