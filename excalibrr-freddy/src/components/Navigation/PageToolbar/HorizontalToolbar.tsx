import { Page } from '../NavigationContext'
import { MenuLinks } from './MenuDisplay/MenuLinks'

type Props = {
  selectedPageGroup: Page
}

export const HorizontalToolbar: React.FC<Props> = ({ selectedPageGroup }) => {
  if (!selectedPageGroup) return null
  return (
    <div className='site-toolbar px-4 bg-1 border-bottom toolbar-shadow flex'>
      <div
        className='flex-1 flex items-center p-3'
        style={{ fontSize: '1.1em' }}
      >
        {selectedPageGroup?.routes && (
          <MenuLinks
            menuItems={selectedPageGroup.routes}
            parentURL={selectedPageGroup.key}
            useDropdowns={false}
            useActiveTag
          />
        )}
      </div>
    </div>
  )
}
