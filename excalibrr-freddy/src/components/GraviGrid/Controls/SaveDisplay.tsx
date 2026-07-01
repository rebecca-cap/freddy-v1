import { LoadingOutlined } from '@ant-design/icons'
import { Texto } from '../../DataDisplay/Texto/Texto'

type Props = {
  saving: boolean
  lastSaved?: string
}

export const SaveDisplay: React.FC<Props> = ({ saving, lastSaved }) => {
  if (saving) {
    return (
      <div className='flex justify-end mr-1 mt-1'>
        <LoadingOutlined />
      </div>
    )
  } else if (lastSaved) {
    return (
      <div className='flex justify-end mr-1 mt-1'>
        <Texto appearance='success' weight='bold' className='pr-3'>
          Changes Saved: {lastSaved}
        </Texto>
      </div>
    )
  }
  return null
}
