import { Menu, Dropdown } from 'antd'
import { Link } from 'react-router-dom'
import { Page } from '../../NavigationContext'

type Props = {
  group: Page
  parentURL: string
}

export const GroupDropdown: React.FC<Props> = ({ group, parentURL }) => {
  const menu = (
    <Menu className='mt-2'>
      {group?.routes?.map((route, j) => {
        return (
          <Menu.Item style={{ width: 200 }} key={j}>
            <Link to={`/${parentURL}/${route.key}`}>{route.title}</Link>
          </Menu.Item>
        )
      })}
    </Menu>
  )

  return (
    <Dropdown overlay={menu}>
      <a
        className='submenu-dropdown-link mx-3'
        onClick={(e) => e.preventDefault()}
      >
        {group.title}
      </a>
    </Dropdown>
  )
}
