import classNames from 'classnames'
import { useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { Texto } from '../../../DataDisplay/Texto/Texto'
import { Page } from '../../NavigationContext'

type Props = {
  group: Page
  parentURL: string
  hasChildSelected?: boolean
  useActiveTag?: boolean
}

export const SinglePageGroup: React.FC<Props> = ({
  group,
  parentURL,
  useActiveTag,
}) => {
  const location = useLocation()
  const isSelected = location.pathname.includes(group.key)
  const unselectedColor = useMemo(
    () => (useActiveTag ? 'var(--theme-color-2)' : 'var(--gray-600)'),
    [useActiveTag]
  )
  return (
    <div
      className={classNames(
        { 'horizontal-selected-background': isSelected },
        { 'horizontal-selected-tag': isSelected && useActiveTag },
        ' flex items-center'
      )}
    >
      <Texto
        className={classNames({ 'selected-group': isSelected }, 'mx-4')}
        category={useActiveTag ? 'h6' : 'h5'}
        {...(isSelected && { weight: 'bold' })}
      >
        <Link
          {...(!isSelected && { style: { color: unselectedColor } })}
          to={`/${parentURL}/${group.key}`}
        >
          {group.title}
        </Link>
      </Texto>
    </div>
  )
}
