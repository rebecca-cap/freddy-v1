import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'

import { BBDTag } from './BBDTag'

type Props = {
  value: number
  threshold: number
  textIfEqual?: string
  invertColors?: boolean
}

export const DeltaTag: React.FC<Props> = ({
  value,
  threshold,
  textIfEqual,
  invertColors = false,
  ...others
}) => {
  function deltaToLowColor() {
    if (
      (value > threshold && !invertColors) ||
      (value < threshold && invertColors)
    ) {
      return { showGreen: true, showRed: false }
    }

    return { showRed: true, showGreen: false }
  }
  const { showRed, showGreen } = deltaToLowColor()

  if (textIfEqual && value === threshold)
    return <BBDTag success>{textIfEqual}</BBDTag>

  return (
    <BBDTag success={showGreen} error={showRed}>
      <DeltaContents threshold={threshold} value={value} {...others} />
    </BBDTag>
  )
}

type DeltaContentProps = {
  value: number
  threshold: number
  lowClass?: string
  highClass?: string
  evenClass?: string
  precision?: number
  prefix?: React.ReactNode
  postfix?: React.ReactNode
}

const DeltaContents: React.FC<DeltaContentProps> = ({
  value,
  threshold = 0,
  lowClass = 'kpiLowValue',
  highClass = 'kpiHighValue',
  evenClass = 'kpiEvenValue',
  precision = 0,
  prefix = '',
  postfix = '',
}) => {
  if (value === threshold) {
    return (
      <div className={evenClass}>
        {prefix}
        {value.toFixed(precision)}
        {postfix}
      </div>
    )
  }

  const icon = value < threshold ? <CaretDownOutlined /> : <CaretUpOutlined />
  const colorClass = value < threshold ? lowClass : highClass

  return (
    <div className={colorClass}>
      {icon} {prefix}
      {value.toFixed(precision)}
      {postfix}
    </div>
  )
}
