import { CloseOutlined } from '@ant-design/icons'
import { BBDTag, GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'

export function DrawerTitle({ handleClose }) {
  return (
    <Horizontal>
      <Vertical>
        <Horizontal gap={10} className={'mb-2'} verticalCenter>
          <Texto appearance={'white'} category={'h5'}>
            Create Index Offer
          </Texto>
          <BBDTag style={{ lineHeight: 'normal', padding: '1px 8px' }}>Formula</BBDTag>
        </Horizontal>
        <Texto appearance={'white'} weight={'normal'}>
          Configure your index-based pricing offer with contract price formula
        </Texto>
      </Vertical>
      <GraviButton
        className={'ghost-gravi-button'}
        icon={
          <Texto appearance={'white'}>
            <CloseOutlined style={{ color: 'inherit' }} />
          </Texto>
        }
        onClick={handleClose}
      />
    </Horizontal>
  )
}
