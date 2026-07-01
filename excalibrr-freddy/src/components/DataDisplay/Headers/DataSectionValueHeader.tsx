import { Col, Row } from 'antd'
// // // // // // // // // //
// This is a simple header for a data section, if you would like something more
// fancy that doesn't only have a title, check out EditSectionHeader below
// // // // // // // // // //

type Props = {
  title: React.ReactNode
  value: React.ReactNode
  className?: string
}

export const DataSectionValueHeader: React.FC<Props> = ({
  title,
  value,
  className,
}) => {
  return (
    <Col className={`detail-section-header ${className}`} span={24}>
      <Row>
        <Col span={12}>
          <div style={{ marginTop: '4%' }} className='detail-section-text'>
            {title}
          </div>
        </Col>
        <Col span={12}>
          <div className='detail-section-value'>{value}</div>
        </Col>
      </Row>
    </Col>
  )
}
