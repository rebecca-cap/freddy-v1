import { Layout, Menu } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { Horizontal } from '../Layout/Horizontal'
import { Vertical } from '../Layout/Vertical'
import { CommandObject, Page, SharedNavigationProps } from './NavigationContext'
import { HorizontalToolbar } from './PageToolbar/HorizontalToolbar'
import { PageToolbar } from './PageToolbar/PageToolbar'
import { QuickSearchModal } from './QuickSearch/QuickSearchModal'
import { useQuickSearch } from './QuickSearch/useQuickSearch'
import { VerticalNav } from './VerticalNav'

const { Sider, Content } = Layout

type PageWrapperProps = Omit<SharedNavigationProps, 'handleLogout'> & {
  validPages: Page[]
  commandObjects: CommandObject[]
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  validPages,
  commandObjects,
  children,
  userControlPane,
  navStyle,
}) => {
  const location = useLocation()
  const { boxVisible, setBoxVisibile, handleQuickSearchSelect } =
    useQuickSearch()
  const [selectedPageGroup, setSelectedPageGroup] = useState<Page>()
  const [sidebarOpened, setSidebarOpened] = useState(false)

  useEffect(() => {
    if (!validPages) {
      return
    }
    const pageGroup = location.pathname.split('/')[1]
    setSelectedPageGroup(validPages.find((group) => group.key === pageGroup))
  }, [location?.pathname, validPages])

  const toggleSidebar = () => {
    document.documentElement.classList.toggle('nav-open')
    setSidebarOpened(!sidebarOpened)
  }

  return (
    <Layout
      style={{ height: '100vh', minWidth: '1400px' }}
      className={sidebarOpened ? 'sidebar-open' : 'sidebar-mini'}
    >
      <QuickSearchModal
        boxVisible={boxVisible}
        setBoxVisibile={setBoxVisibile}
        handleQuickSearchSelect={handleQuickSearchSelect}
        commandObjects={commandObjects}
      />
      {navStyle === 'vertical' ? (
        <VerticalNavLayout
          userControlPane={userControlPane}
          selectedPageGroup={selectedPageGroup}
          toggleSidebar={toggleSidebar}
          validPages={validPages}
          sidebarOpened={sidebarOpened}
        >
          {children}
        </VerticalNavLayout>
      ) : (
        <HorizontalNavLayout
          selectedPageGroup={selectedPageGroup}
          userControlPane={userControlPane}
          validPages={validPages}
        >
          {children}
        </HorizontalNavLayout>
      )}
    </Layout>
  )
}

type HorizontalNavLayoutProps = {
  children: React.ReactNode
  selectedPageGroup?: Page
  validPages: Page[]
  userControlPane: SharedNavigationProps['userControlPane']
}

const HorizontalNavLayout: React.FC<HorizontalNavLayoutProps> = ({
  selectedPageGroup,
  children,
  userControlPane,
  validPages,
}) => {
  const navigate = useNavigate()

  const adminGroup = validPages?.find((p) => p.key?.toLowerCase() === 'admin')
  const hasAdminPageSelected = selectedPageGroup?.key === adminGroup?.key

  const pages = validPages

  return (
    <>
      <Horizontal
        className='horizontal-nav'
        style={{ transition: '0.5s ease', minHeight: 64 }}
        flex='0'
      >
        <Vertical verticalCenter flex='none' width='auto' className='px-3'>
          <div style={{ height: 50, width: 100 }} className='logo' />
        </Vertical>
        <Vertical>
          {validPages && (
            <Menu
              selectedKeys={!selectedPageGroup ? [] : [selectedPageGroup?.key]}
              onClick={({ key }) => navigate(key)}
              mode='horizontal'
            >
              {pages?.map((page) => {
                return <Menu.Item key={page.key}>{page.title}</Menu.Item>
              })}
            </Menu>
          )}
        </Vertical>
        <Vertical verticalCenter flex='0' style={{ minWidth: 260 }}>
          {userControlPane}
        </Vertical>
      </Horizontal>
      {selectedPageGroup?.routes &&
        selectedPageGroup.routes.length > 0 &&
        !hasAdminPageSelected && (
          <HorizontalToolbar selectedPageGroup={selectedPageGroup} />
        )}
    </>
  )
}

type VerticalNavLayoutProps = Omit<
  SharedNavigationProps,
  'handleLogout' | 'navStyle'
> & {
  toggleSidebar: () => void
  validPages: Page[]
  selectedPageGroup?: Page
  sidebarOpened: boolean
}

const VerticalNavLayout: React.FC<VerticalNavLayoutProps> = ({
  userControlPane,
  selectedPageGroup,
  toggleSidebar,
  validPages,
  sidebarOpened,
  children,
}) => {
  const showSideNav = validPages?.length > 1
  const margin = showSideNav ? 0 : '1em'
  return (
    <>
      <PageToolbar
        userControlPane={userControlPane}
        selectedPageGroup={selectedPageGroup}
        toggleSidebar={toggleSidebar}
        showSideNav={showSideNav}
      />
      <Layout style={{ marginLeft: margin }}>
        {showSideNav && (
          <Sider collapsed collapsedWidth={sidebarOpened ? 300 : 130}>
            <VerticalNav
              validPages={validPages}
              // @ts-ignore - another unused prop - but leaving in just in case
              toggleSidebar={toggleSidebar}
            />
          </Sider>
        )}
        <Content>{children}</Content>
      </Layout>
    </>
  )
}
