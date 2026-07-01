import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'

export function DrawerFooter({ handleClose, form }) {
  return (
    <Horizontal gap={10} justifyContent={'flex-end'} verticalCenter>
      <GraviButton buttonText={'Cancel'} onClick={handleClose} />
      <GraviButton buttonText={'Save'} onClick={() => form.submit()} theme1 />
    </Horizontal>
  )
}
