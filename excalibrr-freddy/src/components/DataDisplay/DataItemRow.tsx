import { Col, ColProps, Row } from 'antd'

type Props = {
  label: React.ReactNode
  children: React.ReactNode
  extraClass?: string
  labelSpan?: number
  valueSpan?: number
  labelExtras?: ColProps
}

export const DataItemRow: React.FC<Props> = ({
  label,
  children,
  extraClass,
  labelExtras,
  labelSpan = 12,
  valueSpan = 12,
}) => {
  return (
    <Row className={extraClass}>
      <Col
        span={labelSpan}
        style={{ paddingTop: 0 }}
        className='detail-data-label'
        {...labelExtras}
      >
        {label}
      </Col>
      <Col span={valueSpan} className='detail-data-value'>
        {children}
      </Col>
    </Row>
  )
}
