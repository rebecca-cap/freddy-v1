import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { Texto } from '../../../DataDisplay/Texto/Texto'
import { Page } from '../../NavigationContext'

type Props = {
  group: Page
  parentURL: string
  hasChildSelected?: boolean
  useActiveTag?: boolean
}

export const HorizontalGroup: React.FC<Props> = ({
  group,
  hasChildSelected,
  parentURL,
  useActiveTag,
}) => {
  const location = useLocation()
  return (
    <div className={classNames(' flex items-center')}>
      <Texto
        weight='bold'
        className={classNames({ 'selected-group': hasChildSelected }, 'mx-2')}
        category='h5'
      >
        {group.title}
      </Texto>

      <div
        className='mx-3'
        style={{ width: 1, height: 12, background: 'var(--gray-300)' }}
      />
      <div className='submenu-links  flex items-center'>
        {group?.routes?.map((item, j) => {
          if (item.index || item.query_page) {
            return null
          }
          return (
            <Link
              className={classNames(
                'px-3',
                {
                  selected: location.pathname.includes(item.key),
                },
                {
                  'selected-tag':
                    location.pathname.includes(item.key) && useActiveTag,
                }
              )}
              key={j}
              style={{ fontSize: '1.2em' }}
              to={`/${parentURL}/${item.key}`}
            >
              {item.title}
            </Link>
          )
        })}
      </div>
      <div
        className='mx-3'
        style={{ width: 1, height: 12, background: 'var(--gray-300)' }}
      />
    </div>
  )
}
