import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'
import { FormInstance } from 'antd/lib/form/Form'
interface DrawerFooterProps {
  form: FormInstance
  handleClose: () => void
  isLoading: boolean
}
export function DrawerFooter({ form, handleClose, isLoading }: DrawerFooterProps) {
  return (
    <Horizontal className={'gap-10'} justifyContent={'flex-end'} verticalCenter>
      <GraviButton buttonText={'Cancel'} onClick={handleClose} disabled={isLoading} />
      <GraviButton buttonText={'Save Template'} onClick={() => form.submit()} theme1 loading={isLoading} />
    </Horizontal>
  )
}
