import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons'
import { GraviButton } from '@components/Controls/Buttons/GraviButton'
import { Texto } from '@components/DataDisplay/Texto/Texto'
import { Horizontal } from '@components/Layout/Horizontal'
import { useDirtyGridChanges } from '../hooks/useDirtyGrid'

type Props<T extends Record<string, any>> = {
  dirtyGridApi: ReturnType<typeof useDirtyGridChanges<T>>
}

export function DirtyEditBar<T extends Record<string, any>>({
  dirtyGridApi,
}: Props<T>) {
  return (
    <div
      className='flex px-4 py-3'
      style={{ backgroundColor: 'var(--theme-color-1)' }}
    >
      <Texto
        category='h6'
        appearance='white'
        style={{
          marginRight: 'auto',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <ExclamationCircleOutlined style={{ marginRight: 8 }} />
        {dirtyGridApi.unsavedRowCount} unsaved row
        {dirtyGridApi.unsavedRowCount > 1 && 's'}
      </Texto>
      <Horizontal style={{ gap: 8 }}>
        <GraviButton
          icon={<DeleteOutlined />}
          buttonText='Discard'
          onClick={dirtyGridApi.handleDirtyDiscard}
        />
        <GraviButton
          icon={<SaveOutlined />}
          buttonText='Save'
          theme2
          onClick={dirtyGridApi.handleDirtySave}
        />
      </Horizontal>
    </div>
  )
}
