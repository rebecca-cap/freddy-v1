import { Col, Row } from 'antd'
// // // // // // // // // //
// This is a simple header for a data section, if you would like something more
// fancy that doesn't only have a title, check out EditSectionHeader below
// // // // // // // // // //

type Props = {
  title: string
  className?: string
}

export const DataSectionHeader: React.FC<Props> = ({ title, className }) => {
  return (
    <Col className={`detail-section-header ${className}`} span={24}>
      <Row>
        <Col span={24}>
          <div className='detail-section-text'>{title}</div>
        </Col>
      </Row>
    </Col>
  )
}
