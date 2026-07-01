import classNames from 'classnames'
import type { CSSProperties, FC, ReactNode } from 'react'
import { createElement } from 'react'

// 'as const' tells TS that these arrays are immutable and won't change.
// This is needed because we're creating types from the literals below and
// that's only possible if the the array never changes (or object) never changes.
const pDict = ['p1', 'p2', 'label', 'heading', 'heading-small'] as const
const hDict = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const

const appearanceDict = {
  white: 'text-white',
  light: 'text-light',
  hint: 'text-hint',
  default: 'text-default',
  medium: 'text-medium',
  primary: 'text-primary',
  secondary: 'text-secondary',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-error',
  theme3: 'text-theme-3',
  optimal: 'text-optimal',
}

type PItem = typeof pDict[number]
type HItem = typeof hDict[number]
type Appearance = keyof typeof appearanceDict

export type TextoProps = {
  category?: PItem | HItem
  align?: CSSProperties['textAlign']
  appearance?: Appearance
  weight?: CSSProperties['fontWeight']
  textTransform?: CSSProperties['textTransform']
  children: ReactNode
  style?: CSSProperties
  className?: string
}

export const Texto: FC<TextoProps> = ({
  category = 'p1',
  align = 'left',
  appearance = 'default',
  weight,
  textTransform,
  children,
  style,
  className,
}) => {
  // Type guard to narrow category down to either a p or h item in the branching below
  // Here the "x is PItem" tells TS that if this fn returns true then x is one of the pDict literals
  // ..otherwise its always an h item
  const isInPDict = (x: string): x is PItem => pDict.includes(x as PItem)

  if (isInPDict(category)) {
    return (
      <p
        className={classNames(
          category,
          appearanceDict[appearance],
          'texto',
          className
        )}
        style={{
          textAlign: align,
          fontWeight: weight,
          textTransform: textTransform,
          ...style,
        }}
      >
        {children}
      </p>
    )
  } else {
    return createElement(
      category,
      {
        className: classNames(appearanceDict[appearance], 'texto', className),
        style: {
          textAlign: align,
          fontWeight: weight,
          textTransform,
          ...style,
        },
      },
      children
    )
  }
}
