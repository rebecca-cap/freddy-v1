import { useLocation } from 'react-router-dom'

import { Page } from '../../NavigationContext'
import { GroupDropdown } from './GroupDropdown'
import { HorizontalGroup } from './HorizontalGroup'
import { SinglePageGroup } from './SinglePageGroup'

type Props = {
  menuItems: Page[]
  parentURL: string
  useDropdowns?: boolean
  useActiveTag?: boolean
}

export const MenuLinks: React.FC<Props> = ({
  menuItems,
  parentURL,
  useDropdowns = true,
  useActiveTag,
}) => {
  const location = useLocation()
  if (
    menuItems.filter(
      (route) => !route.index && !route.query_page && !route.hideNav
    ).length === 0
  ) {
    return null
  }
  return (
    <div className='flex-1 px-4 flex items-center'>
      {menuItems.map((m, i) => {
        if (m.index || m.query_page) {
          return
        }
        const hasChildSelected = m.routes?.some((page) =>
          location.pathname.includes(page.key)
        )
        if (!m.routes || m.routes.length === 0) {
          return (
            <SinglePageGroup
              useActiveTag={useActiveTag}
              parentURL={parentURL}
              key={i}
              group={m}
            />
          )
        }
        if (hasChildSelected || !useDropdowns) {
          return (
            <HorizontalGroup
              key={i}
              group={m}
              parentURL={parentURL}
              hasChildSelected={hasChildSelected}
            />
          )
        }
        return <GroupDropdown parentURL={parentURL} group={m} key={i} />
      })}
    </div>
  )
}
