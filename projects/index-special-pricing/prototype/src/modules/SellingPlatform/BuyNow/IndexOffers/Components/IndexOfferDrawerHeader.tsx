import { useIndexOffersContext } from '@contexts/IndexOffersContext'
import { BBDTag, Texto, Vertical } from '@gravitate-js/excalibrr'

export function IndexOfferDrawerHeader() {
  const { selectedIndexOffer } = useIndexOffersContext()

  const productName = selectedIndexOffer?.ProductName ?? '-'
  const locationName = selectedIndexOffer?.LocationName ?? '-'

  return (
    <Vertical className={'px-5 py-3'} verticalCenter gap={8}>
      <BBDTag theme2 style={{ maxWidth: 100 }}>
        Index Purchase
      </BBDTag>
      <Texto appearance='white'>
        {productName} @ {locationName}
      </Texto>
    </Vertical>
  )
}
