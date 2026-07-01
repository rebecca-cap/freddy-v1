import { CloseOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { ViewMode } from '@modules/FormulaTemplates/Util/formConstants'
interface DrawerHeaderProps {
  viewMode: ViewMode
  handleClose: () => void
}
export function DrawerHeader({ viewMode, handleClose }: DrawerHeaderProps) {
  return (
    <Horizontal justifyContent={'space-between'} verticalCenter className={'p-1'}>
      <Vertical>
        <Texto appearance={'white'} category={'h5'} className={'mb-2'}>
          {viewMode} Formula Template
        </Texto>
        <Texto weight={'normal'} style={{ color: '#eee' }}>
          Define template components, formula display, and metadata
        </Texto>
      </Vertical>
      <GraviButton
        className={'ghost-gravi-button'}
        icon={<CloseOutlined style={{ color: '#eee' }} />}
        onClick={handleClose}
      />
    </Horizontal>
  )
}
