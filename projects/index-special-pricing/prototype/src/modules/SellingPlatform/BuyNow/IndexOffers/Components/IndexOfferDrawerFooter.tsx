import { useIndexOffersContext } from '@contexts/IndexOffersContext'
import { GraviButton, Horizontal, Texto } from '@gravitate-js/excalibrr'
import styles from '../styles.module.css'

interface IndexOfferDrawerFooterProps {
  onCancel: () => void
  onSubmit: () => void
  isSubmitting?: boolean
  isLoading?: boolean
}

export function IndexOfferDrawerFooter({ onCancel, onSubmit, isSubmitting, isLoading }: IndexOfferDrawerFooterProps) {
  const { entryData } = useIndexOffersContext()
  const isBid = entryData?.IsBid ?? false
  const submitLabel = isBid ? 'Submit Bid' : 'Submit Order'
  const isDisabled = isSubmitting || isLoading

  return (
    <Horizontal justifyContent='flex-end' verticalCenter className={styles.drawerFooter}>
      <Horizontal gap={2}>
        <GraviButton className={'mr-4'} size={'large'} buttonText='Cancel' onClick={onCancel} disabled={isSubmitting} />
        <GraviButton
          size={'large'}
          className={!isBid ? styles.orderSubmitButton : ''}
          color={isBid ? 'primary' : undefined}
          onClick={onSubmit}
          loading={isSubmitting}
          disabled={isDisabled}
        >
          {isBid ? submitLabel : <Texto appearance={'white'}>{submitLabel}</Texto>}
        </GraviButton>
      </Horizontal>
    </Horizontal>
  )
}
