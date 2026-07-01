import type { CSSProperties } from 'react'
import { borderEnum } from './constants'
import classNames from 'classnames'

interface IProps {
  alignItems?: CSSProperties['alignItems']
  justifyContent?: CSSProperties['justifyContent']
  verticalCenter?: boolean
  horizontalCenter?: boolean
  flex?: CSSProperties['flex']
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  border?: keyof typeof borderEnum
  background?: CSSProperties['background']
  fullHeight?: boolean
  borderRadius?: CSSProperties['borderRadius']
  scroll?: boolean
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  onClick?: () => void
}

export const Horizontal: React.FC<IProps> = ({
  alignItems,
  justifyContent,
  flex,
  verticalCenter = false,
  horizontalCenter = false,
  width,
  height,
  fullHeight = false,
  background,
  border,
  borderRadius,
  className,
  scroll,
  style,
  children,
  onClick,
}) => {
  const rowStyle = {
    display: 'flex',
    flex: flex || '0 1 auto',
    alignItems: verticalCenter ? 'center' : alignItems,
    justifyContent: horizontalCenter ? 'center' : justifyContent,
    width: width,
    height: height,
    overflow: scroll ? 'auto' : 'hidden',
    background: background ? `var(--${background})` : '',
    borderRadius: borderRadius || '',
    ...(border && { border: borderEnum[border] }),
    ...style,
  } as CSSProperties

  return (
    <div
      style={rowStyle}
      className={classNames(className, { 'h-100': fullHeight })}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
