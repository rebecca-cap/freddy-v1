import { GraviButton, Horizontal } from '@gravitate-js/excalibrr'

interface IndexOfferDrawerFooterProps {
  onCancel: () => void
  onSubmit: () => void
  isSubmitting?: boolean
}

export function IndexOfferDrawerFooter({
  onCancel,
  onSubmit,
  isSubmitting,
}: IndexOfferDrawerFooterProps) {
  return (
    <Horizontal justifyContent='flex-end' verticalCenter className='index-offer-drawer-footer'>
      <Horizontal className='gap-2'>
        <GraviButton className={'mr-4'} size={'large'} buttonText='Cancel' onClick={onCancel} disabled={isSubmitting} />
        <GraviButton
          buttonText='Submit'
          size={'large'}
          success
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </Horizontal>
    </Horizontal>
  )
}
