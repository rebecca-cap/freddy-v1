import { Texto } from '../../DataDisplay/Texto/Texto'
import { LoadingOutlined } from '@ant-design/icons'
export const SpinningOverlay = () => {
  return (
    <Texto category='h1' appearance='secondary'>
      <LoadingOutlined />
    </Texto>
  )
}
