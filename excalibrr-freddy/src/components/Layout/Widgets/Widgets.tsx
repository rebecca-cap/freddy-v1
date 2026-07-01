import { Row, Col } from 'antd'
import { WidgetUnderline } from '../../SVGasComponents/WidgetSVGs'

// // // // // // // // // //
// WIDGET HEADER
// This is a super simple component that puts a little flair on a header
// // // // // // // // // //

type WidgetHeaderProps = {
  title: string
  controls: React.ReactNode
  titleSpan?: number
  controlSpan?: number
  useWhiteIcon?: boolean
  alignControls?: string
}

export const WidgetHeader: React.FC<WidgetHeaderProps> = ({
  title,
  controls,
  titleSpan = 12,
  controlSpan = 12,
  useWhiteIcon = false,
  alignControls = '',
}) => {
  return (
    <Row className='widget-header'>
      <Col span={titleSpan}>
        <UnderlineHeader title={title} useWhiteIcon={useWhiteIcon} />
      </Col>
      {/** @ts-ignore align isn't recognized by antd (outdated version?) */}
      <Col span={controlSpan} align={alignControls}>
        {controls}
      </Col>
    </Row>
  )
}

// // // // // // // // // //
// Underline HEADER - used in WidgetHeader and exported separately
// This is a super simple component that puts a little flair on a header
// // // // // // // // // //

type UnderlineHeaderProps = {
  title: string
  useWhiteIcon?: boolean
}

export const UnderlineHeader: React.FC<UnderlineHeaderProps> = ({
  title,
  useWhiteIcon,
}) => {
  return (
    <div className='widget-title'>
      {title}
      {useWhiteIcon ? <WidgetUnderline color='#fff' /> : <WidgetUnderline />}
    </div>
  )
}
