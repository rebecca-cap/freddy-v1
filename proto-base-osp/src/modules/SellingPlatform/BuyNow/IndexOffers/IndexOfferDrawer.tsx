import styles from './styles.module.css'

import { CloseOutlined } from '@ant-design/icons'
import { dateFormat } from '@components/TheArmory/helpers'
import { useIndexOffersContext } from '@contexts/IndexOffersContext'
import { Horizontal, Vertical } from '@gravitate-js/excalibrr'
import { IndexOfferAdditionalTerms } from '@modules/SellingPlatform/BuyNow/IndexOffers/Components/IndexOfferAdditionalTerms'
import { IndexOfferDetails } from '@modules/SellingPlatform/BuyNow/IndexOffers/Components/IndexOfferDetails'
import { IndexOfferDrawerFooter } from '@modules/SellingPlatform/BuyNow/IndexOffers/Components/IndexOfferDrawerFooter'
import { IndexOfferDrawerHeader } from '@modules/SellingPlatform/BuyNow/IndexOffers/Components/IndexOfferDrawerHeader'
import { IndexOfferPricing } from '@modules/SellingPlatform/BuyNow/IndexOffers/Components/IndexOfferPricing'
import type { IndexOfferSubmitOrderRequest } from '@modules/SellingPlatform/BuyNow/Offers/Api/types.schema'
import { PurchaseType } from '@modules/SellingPlatform/BuyNow/sharedComponents/PurchaseType'
import dayjs from '@utils/dayjs'
import { Button, Drawer, Form, Spin } from 'antd'
import type { Dispatch, SetStateAction } from 'react'

interface IndexOfferDrawerProps {
  isDrawerVisible: boolean
  setIsDrawerVisible: Dispatch<SetStateAction<boolean>>
}

export function IndexOfferDrawer({ isDrawerVisible, setIsDrawerVisible }: IndexOfferDrawerProps) {
  const [form] = Form.useForm()
  const { clearIndexOffer, isLoading, isSubmitting, entryData, handleSubmitOrder } = useIndexOffersContext()
  const isBid = entryData?.IsBid ?? false

  const handleClose = () => {
    form.resetFields()
    setIsDrawerVisible(false)
    clearIndexOffer()
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()

      if (!entryData?.SelectedIndexOffer?.ItemKey) {
        return
      }

      const payload: IndexOfferSubmitOrderRequest = {
        ItemKey: entryData.SelectedIndexOffer.ItemKey,
        Volume: values.Volume,
        LoadingNumberIds: Array.isArray(values.LoadingNumbersIds)
          ? values.LoadingNumbersIds
          : [values.LoadingNumbersIds].filter(Boolean),
        BidPrice: isBid ? values.BidPrice : undefined,
        BidExpiry: isBid ? dayjs(values.BidExpiration).format(dateFormat.ISO_V2) : undefined,
        ShouldSendExternalNotification: true,
      }

      handleSubmitOrder(payload, { onSuccess: handleClose })
    } catch {
      // form validation failed
    }
  }

  return (
    <Drawer
      title={<IndexOfferDrawerHeader />}
      placement='bottom'
      height='90%'
      open={isDrawerVisible}
      onClose={handleClose}
      closable={false}
      className='index-offer-drawer'
      extra={<Button type='text' icon={<CloseOutlined />} onClick={handleClose} />}
      destroyOnHidden={true}
      footer={
        <IndexOfferDrawerFooter
          onCancel={handleClose}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isLoading={isLoading}
        />
      }
    >
      <Spin spinning={isLoading || isSubmitting} size='large'>
        <Form form={form} name='indexOfferDrawerForm' layout='vertical'>
          <Horizontal className={`bg-2 border-bottom px-5 py-4 ${styles.purchaseTypeBar}`}>
            <PurchaseType isBid={isBid} />
          </Horizontal>
          <Vertical>
            <Horizontal gap={24} className={'px-5 py-4'}>
              <IndexOfferDetails />
              <IndexOfferPricing form={form} />
              <IndexOfferAdditionalTerms />
            </Horizontal>
          </Vertical>
        </Form>
      </Spin>
    </Drawer>
  )
}
