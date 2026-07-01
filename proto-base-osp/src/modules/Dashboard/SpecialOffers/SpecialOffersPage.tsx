import './styles.css'

import { Permission, useUser } from '@contexts/UserContext'
import { SpecialOffer } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { useSpecialOffersTyped } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffersTyped'
import { CreateNewSpecialOffer } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/CreateNewSpecialOffer'
import { SpecialOffersGrid } from '@modules/Dashboard/SpecialOffers/Components/Grid/SpecialOffersGrid'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function SpecialOffersPage() {
  const { getSpecialOffers, getSpecialOfferMetadata } = useSpecialOffersTyped()
  const [isShowingCreateNew, setIsShowingCreateNew] = useState(false)
  const [priorOffer, setPriorOffer] = useState<SpecialOffer | undefined>()
  const navigate = useNavigate()

  const { data: rowData = [], isFetching } = getSpecialOffers()
  const { data: metadata } = getSpecialOfferMetadata()
  const { hasPermission } = useUser()
  const canWrite = hasPermission(Permission.MarketPlatform_SpecialOfferAdmin_Write)

  const handleOpenOffer = (offer: SpecialOffer) => {
    navigate(`/ManageOffers/${offer.SpecialOfferId}`)
  }

  const handleCreateFromPrior = (offer: SpecialOffer) => {
    setPriorOffer(offer)
    setIsShowingCreateNew(true)
  }

  const handleDrawerClose = () => {
    setIsShowingCreateNew(false)
    setPriorOffer(undefined)
  }

  return (
    <div style={{ height: '99%', width: '100%' }}>
      <SpecialOffersGrid
        isFetching={isFetching}
        rowData={rowData}
        setIsShowingCreateNew={setIsShowingCreateNew}
        onOpenOffer={handleOpenOffer}
        onCreateFromPrior={handleCreateFromPrior}
        canWrite={canWrite}
        metadata={metadata?.Data}
      />
      <CreateNewSpecialOffer
        isShowingCreateNew={isShowingCreateNew}
        setIsShowingCreateNew={setIsShowingCreateNew}
        onClose={handleDrawerClose}
        priorOffer={priorOffer}
        metadata={metadata?.Data}
      />
    </div>
  )
}
