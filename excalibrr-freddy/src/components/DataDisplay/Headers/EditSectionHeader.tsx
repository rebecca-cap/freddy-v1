import { Fragment } from 'react'
import { Col, Row } from 'antd'
import { EditSaveButton } from '../../Controls/Buttons/EditSaveButton'

// // // // // // // // // //
// this is a section header that manages an editing state of the data section,
// is configurable with the onEdit prop so that you can trigger an edit function for the
// section you would like!
// // // // // // // // // //

type Props = {
  title: string
  editing: boolean
  onEdit: () => void
  success?: boolean
  leftAlignToggle?: boolean
  children?: React.ReactNode
  titleSpan?: number
}

export const EditSectionHeader: React.FC<Props> = ({
  title,
  editing,
  onEdit,
  success,
  leftAlignToggle = false,
  children,
  titleSpan = 12,
}) => {
  const successStyle = success ? 'success' : ''
  return (
    <Col className={'detail-section-header ' + successStyle} span={24}>
      <Row>
        {leftAlignToggle && (
          <Fragment>
            <Col span={titleSpan}>
              <span className='detail-section-text mr-2'>{title}</span>
              <EditSaveButton
                editing={editing}
                onEdit={onEdit}
                extraClasses='ml-3'
              />
            </Col>
            {children}
          </Fragment>
        )}
        {!leftAlignToggle && (
          <Fragment>
            <Col span={18}>
              <span className='detail-section-text'>{title}</span>
            </Col>
            {/* @ts-ignore */}
            <Col align='right' span={6}>
              <EditSaveButton editing={editing} onEdit={onEdit} />
            </Col>
          </Fragment>
        )}
      </Row>
    </Col>
  )
}
