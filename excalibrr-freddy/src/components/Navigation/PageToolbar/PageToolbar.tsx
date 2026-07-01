import { MenuUnfoldOutlined } from '@ant-design/icons'

import { GraviButton } from '../../Controls/Buttons/GraviButton'
import { Texto } from '../../DataDisplay/Texto/Texto'
import { MenuLinks } from './MenuDisplay/MenuLinks'

type Props = {
  selectedPageGroup: any
  userControlPane: React.ReactNode
  toggleSidebar: () => void
  showSideNav: boolean
}

export const PageToolbar: React.FC<Props> = ({
  selectedPageGroup,
  userControlPane,
  toggleSidebar,
  showSideNav,
}) => {
  if (!selectedPageGroup) return null
  return (
    <div className='site-toolbar px-4  flex'>
      <div className='flex items-center pl-1' style={{ height: 64 }}>
        {showSideNav && (
          <div
            className='flex items-center justify-center px-3 py-2'
            style={{ width: 80, height: 64 }}
          >
            <GraviButton
              icon={<MenuUnfoldOutlined />}
              onClick={toggleSidebar}
            />
          </div>
        )}
        <div
          className='mx-4'
          style={{ width: 2, height: 20, background: 'var(--gray-300)' }}
        />
        <Texto className='flex items-center px-2 py-2' category='heading'>
          <span className='mr-3'>{selectedPageGroup?.icon}</span>

          {selectedPageGroup?.title}
        </Texto>
      </div>
      <div className='flex-1 flex items-center'>
        {selectedPageGroup?.routes && (
          <MenuLinks
            menuItems={selectedPageGroup.routes}
            parentURL={selectedPageGroup.key}
          />
        )}
      </div>
      {userControlPane}
    </div>
  )
}
