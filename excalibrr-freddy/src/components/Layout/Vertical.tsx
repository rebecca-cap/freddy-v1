import { CSSProperties } from 'react'
import { borderEnum } from './constants'

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
  borderRadius?: CSSProperties['borderRadius']
  scroll?: boolean
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  onClick?: () => void
}

export const Vertical: React.FC<IProps> = ({
  alignItems,
  justifyContent,
  verticalCenter = false,
  horizontalCenter = false,
  flex,
  width,
  height,
  border,
  background,
  borderRadius,
  scroll,
  className,
  style,
  children,
  onClick,
}) => {
  const colStyle = {
    display: 'flex',
    flexDirection: 'column',
    flex: flex || '1 1 auto',
    alignItems: horizontalCenter ? 'center' : alignItems,
    justifyContent: verticalCenter ? 'center' : justifyContent,
    width: width,
    height: height || '100%',
    overflow: scroll ? 'auto' : 'hidden',
    background: background ? `var(--${background})` : '',
    borderRadius: borderRadius || '',
    ...(border && { border: borderEnum[border] }),
    ...style,
  } as CSSProperties

  return (
    <div onClick={onClick} style={colStyle} className={className}>
      {children}
    </div>
  )
}
