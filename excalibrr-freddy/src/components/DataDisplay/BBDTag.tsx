import { Tag, TagProps } from 'antd'
import type { CSSProperties, FC, ReactNode } from 'react'
import { ThemeVariants } from '../../types/common'

type Props = Partial<ThemeVariants & TagProps> & {
  textTransform?: CSSProperties['textTransform']
  className?: string
  children: ReactNode
  style?: CSSProperties
}

export const BBDTag: FC<Props> = ({
  theme1,
  theme2,
  theme3,
  theme4,
  success,
  warning,
  error,
  textTransform,
  className,
  children,
  style,
  ...rest
}) => {
  let tagClass = ''
  tagClass = theme1 ? 'theme-1-tag' : tagClass
  tagClass = theme2 ? 'theme-2-tag' : tagClass
  tagClass = theme3 ? 'theme-3-tag' : tagClass
  tagClass = theme4 ? 'theme-4-tag' : tagClass
  tagClass = success ? 'bbd-success-tag' : tagClass
  tagClass = warning ? 'bbd-warning-tag' : tagClass
  tagClass = error ? 'bbd-error-tag' : tagClass
  tagClass += className ? ` ${className}` : ''

  return (
    <Tag
      className={tagClass}
      style={{ textTransform: textTransform, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
