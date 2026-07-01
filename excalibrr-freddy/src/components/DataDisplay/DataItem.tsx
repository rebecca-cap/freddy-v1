interface IProps {
  label?: string
  children?: React.ReactNode
  extraClass?: string
  labelExtras?: React.HTMLAttributes<HTMLDivElement>
  valueStyle?: React.CSSProperties
}

export const DataItem: React.FC<IProps> = ({
  label,
  children,
  extraClass,
  labelExtras,
  valueStyle,
}) => {
  return (
    <div className={extraClass}>
      <div className='detail-data-label' {...labelExtras}>
        {label}
      </div>
      <div className='detail-data-value' style={valueStyle}>
        {children}
      </div>
    </div>
  )
}
