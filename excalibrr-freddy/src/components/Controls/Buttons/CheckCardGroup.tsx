import { Checkbox, Col, Row } from 'antd'

import { Texto, TextoProps } from '../../DataDisplay/Texto/Texto'

type CheckCardGroupProps = {
  header: React.ReactNode
  children: React.ReactNode
}

export const CheckCardGroup: React.FC<CheckCardGroupProps> = ({
  header,
  children,
}) => {
  return (
    <Row>
      <Col span={24}>
        <Row className='option-header'>{header}</Row>
        <Row className='option-container'>{children}</Row>
      </Col>
    </Row>
  )
}

type CheckCardProps = {
  label: React.ReactNode
  value: boolean
  onToggle: () => void
  span?: number
  boxHeight?: number
  boxWidth?: number | string
  labelCategory?: TextoProps['category']
}

export const CheckCard: React.FC<CheckCardProps> = ({
  label,
  value,
  onToggle,
  span = 8,
  boxHeight = 80,
  boxWidth = 'auto',
  labelCategory = 'h6',
}) => {
  const checkedClass = value ? 'checked' : 'unchecked'
  return (
    <Col className='mt-3' span={span}>
      <div
        className={`option-check h-100 vertical-flex-center${checkedClass}`}
        onClick={onToggle}
        style={{ width: boxWidth }}
      >
        <div style={{ height: boxHeight }} className='flex'>
          <Checkbox
            className='option-checkbox'
            checked={value}
            onChange={onToggle}
          />
        </div>
        <div className='checkbox-label flex-1 vertical-flex-center justify-center'>
          <Texto
            className='checkbox-label'
            category={labelCategory}
            weight='bold'
            align='center'
          >
            {label}
          </Texto>
        </div>
      </div>
    </Col>
  )
}
