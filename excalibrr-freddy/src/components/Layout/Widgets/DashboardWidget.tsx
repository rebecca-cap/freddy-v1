import { WidgetHeader } from './Widgets'

type Props = {
  widgetTitle?: string
  flex?: number
  headerChildren?: React.ReactNode
  children?: React.ReactNode
  className?: string
  titleSpan?: number
  controlSpan?: number
  useWhiteIcon?: boolean
  alignControls?: string
}

export const DashboardWidget: React.FC<Props> = ({
  widgetTitle,
  flex,
  headerChildren,
  children,
  className,
  titleSpan,
  controlSpan,
  useWhiteIcon = false,
  alignControls = '',
}) => {
  const flexClass = flex ? '' : `flex-${flex}`
  return (
    <div className={`driver-widget ${className} ${flexClass}`}>
      {widgetTitle && (
        <WidgetHeader
          title={widgetTitle}
          controls={headerChildren}
          titleSpan={titleSpan}
          alignControls={alignControls}
          controlSpan={controlSpan}
          useWhiteIcon={useWhiteIcon}
        />
      )}
      {children}
    </div>
  )
}
