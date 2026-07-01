import { SearchOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import { Texto } from '../DataDisplay/Texto/Texto'
import { Page } from './NavigationContext'
import { getChildrenCount, getKeyLetter, getSpecialKey } from './util'

const { Text } = Typography

type VerticalNavProps = {
  validPages: Page[]
}

export const VerticalNav: React.FC<VerticalNavProps> = ({ validPages }) => {
  const location = useLocation()
  const sidebarRef = useRef(null)
  const activeRoute = (routeName: string) => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const isMatch =
      pathSegments[pathSegments.length - 1] === routeName ||
      pathSegments[0] === routeName

    return isMatch ? 'active' : ''
  }
  const [expandedKey, setExpandedKey] = useState<string>()

  return (
    <div className='sidebar'>
      <div className='sidebar-wrapper' ref={sidebarRef}>
        <div className='logo my-3'>
          <a className='nav-logo logo-mini' />
          <span className='logo-normal simple-text'>
            <SearchOutlined className='px-1' /> Search
            <Text className='pl-2' keyboard>
              {getSpecialKey()}
            </Text>
            <Text keyboard>{getKeyLetter()}</Text>
          </span>
        </div>
        <div className='nav'>
          {validPages?.map((group, key) => {
            return (
              <PageGroup
                key={key}
                group={group}
                activeRoute={activeRoute}
                expandedKey={expandedKey}
                setExpandedKey={setExpandedKey}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

type PageGroupProps = {
  group: Page
  activeRoute: (routeName: string) => string
  expandedKey?: string
  setExpandedKey: (key: string | undefined) => void
}

const PageGroup: React.FC<PageGroupProps> = ({
  group,
  activeRoute,
  expandedKey,
  setExpandedKey,
}) => {
  const navigate = useNavigate()
  const showExpand =
    group.routes &&
    group.routes.filter(
      (route) => !route.index && !route.query_page && !route.hideNav
    ).length !== 0
  const expandGroup = () => {
    if (expandedKey === group.key) {
      setExpandedKey(undefined)
    } else {
      navigate(group.key)
      setExpandedKey(group.key)
    }
  }
  if (showExpand) {
    return (
      <div className={classNames('nav-li', activeRoute(group.key))}>
        <a onClick={expandGroup}>
          <i>{group.icon}</i>
          <p>
            {group.title}
            {showExpand && (
              <b
                className={classNames('caret', {
                  expanded: expandedKey === group.key,
                })}
              />
            )}
          </p>
        </a>
        {showExpand && (
          <SubPageExpand
            groupExpanded={expandedKey === group.key}
            group={group}
            activeRoute={activeRoute}
          />
        )}
      </div>
    )
  }
  return (
    <div className={classNames('nav-li', activeRoute(group.key))}>
      <NavLink
        to={group.key}
        className={({ isActive }) =>
          isActive ? 'nav-link active' : 'nav-link'
        }
      >
        <i>{group.icon}</i>
        <p>{group.title}</p>
      </NavLink>
    </div>
  )
}

type SubPageExpandProps = {
  group: Page
  activeRoute: (routeName: string) => string
  groupExpanded: boolean
}

const SubPageExpand: React.FC<SubPageExpandProps> = ({
  group,
  activeRoute,
  groupExpanded,
}) => {
  return (
    <div
      className={classNames('group-expand', { expanded: groupExpanded })}
      style={{ height: groupExpanded ? 45 * getChildrenCount(group) : 0 }}
    >
      {group?.routes?.map((subPage) => {
        if (subPage.index || subPage.query_page) {
          return null
        }
        if (subPage.routes && subPage.routes.length > 0) {
          return (
            <SubPageGroupings
              key={subPage.key}
              subPage={subPage}
              group={group}
              activeRoute={activeRoute}
            />
          )
        }
        return (
          <div
            key={subPage.key}
            className={classNames('nav-li', activeRoute(subPage.key))}
          >
            <NavLink
              to={`/${group.key}/${subPage.key}`}
              className={({ isActive }) =>
                isActive ? 'nav-link child active' : 'nav-link child'
              }
              style={{ margin: '0 0 0 10px', padding: '0.5em 10px' }}
            >
              <p>{subPage.title}</p>
            </NavLink>
          </div>
        )
      })}
    </div>
  )
}
type SubPageGroupingsProps = {
  subPage: Page
  activeRoute: (routeName: string) => string
  group: Page
}

const SubPageGroupings: React.FC<SubPageGroupingsProps> = ({
  subPage,
  activeRoute,
  group,
}) => {
  return (
    <>
      <Texto appearance='white' category='p2' weight='bold' className='my-2'>
        {subPage.title}
      </Texto>
      {subPage?.routes?.map((screen, i) => {
        if (screen.index) {
          return null
        }
        return (
          <div
            key={screen.key}
            className={classNames('nav-li', activeRoute(screen.key))}
          >
            <NavLink
              to={`/${group.key}/${screen.key}`}
              style={{ margin: '0 0 0 10px', padding: '0.5em 10px' }}
              className={({ isActive }) =>
                isActive ? 'nav-link child active' : 'nav-link child'
              }
            >
              <p>{screen.title}</p>
            </NavLink>
          </div>
        )
      })}
    </>
  )
}
