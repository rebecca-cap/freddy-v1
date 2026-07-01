import './styles.css'

import { Permission, useUser } from '@contexts/UserContext'
import { SpecialOffer } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { useSpecialOffers } from '@modules/Dashboard/SpecialOffers/Api/useSpecialOffers'
import { CreateNewSpecialOffer } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/CreateNewSpecialOffer'
import { SpecialOffersGrid } from '@modules/Dashboard/SpecialOffers/Components/Grid/SpecialOffersGrid'
import { ManageSpecialOffer } from '@modules/Dashboard/SpecialOffers/Components/Manage/ManageSpecialOffer'
import { useState } from 'react'

export function SpecialOffersPage() {
  const { getSpecialOffers, getSpecialOfferMetadata } = useSpecialOffers()
  const [isShowingCreateNew, setIsShowingCreateNew] = useState(false)
  const [isShowingManage, setIsShowingManage] = useState(false)
  const [selectedSpecialOffer, setSelectedSpecialOffer] = useState<SpecialOffer | null>(null)

  const { data: rowData = [], isFetching } = getSpecialOffers()
  const { data: metadata } = getSpecialOfferMetadata()
  const { hasPermission } = useUser()
  const canWrite = hasPermission(Permission.MarketPlatform_SpecialOfferAdmin_Write)
  return (
    <div style={{ height: '99%', width: '100%' }}>
      <SpecialOffersGrid
        isFetching={isFetching}
        rowData={rowData}
        setIsShowingCreateNew={setIsShowingCreateNew}
        isShowingManage={isShowingManage}
        setIsShowingManage={setIsShowingManage}
        setSelectedSpecialOffer={setSelectedSpecialOffer}
        canWrite={canWrite}
        metadata={metadata?.Data}
      />
      <CreateNewSpecialOffer
        isShowingCreateNew={isShowingCreateNew}
        setIsShowingCreateNew={setIsShowingCreateNew}
        metadata={metadata?.Data}
      />
      <ManageSpecialOffer
        isShowingManage={isShowingManage}
        setIsShowingManage={setIsShowingManage}
        selectedSpecialOffer={selectedSpecialOffer}
        canWrite={canWrite}
      />
    </div>
  )
}
