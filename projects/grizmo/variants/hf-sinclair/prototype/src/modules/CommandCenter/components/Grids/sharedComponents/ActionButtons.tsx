import { ArrowsAltOutlined, SettingOutlined } from '@ant-design/icons'
import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { WidgetTitle } from '@modules/CommandCenter/api/types.schema'

export function ActionButtons({
  title,
  openDrawer,
  openModal,
}: {
  title: WidgetTitle
  openDrawer: (title: WidgetTitle) => void
  openModal: (title: WidgetTitle) => void
}) {
  return (
    <Horizontal>
      <GraviButton onClick={() => openDrawer(title)} icon={<SettingOutlined />} className='ghost-gravi-button' />
      <GraviButton onClick={() => openModal(title)} icon={<ArrowsAltOutlined />} className='ghost-gravi-button' />
    </Horizontal>
  )
}
