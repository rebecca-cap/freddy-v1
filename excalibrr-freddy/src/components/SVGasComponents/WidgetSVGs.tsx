// Underline accent

type WidgetUnderlineProps = {
  color?: string
  width?: string
  height?: string
}

export const WidgetUnderline: React.FC<WidgetUnderlineProps> = ({
  color,
  width,
  height,
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={width}
      height={height}
      fill='none'
      viewBox='0 0 41 2'
    >
      <path stroke={color} strokeWidth='2' d='M0.084 1L31.601 1' />
      <path stroke={color} strokeWidth='2' d='M35.899 1L40.197 1' />
    </svg>
  )
}

WidgetUnderline.defaultProps = {
  color: '#002140',
  width: '41',
  height: '2',
}
