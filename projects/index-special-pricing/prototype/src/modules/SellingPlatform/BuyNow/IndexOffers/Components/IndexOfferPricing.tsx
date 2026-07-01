import { useIndexOffersContext } from '@contexts/IndexOffersContext'
import { GraviButton, Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { TitleText } from '@modules/SellingPlatform/BuyNow/IndexOffers/Components/TitleText'
import { BidExpiration } from '@modules/SellingPlatform/BuyNow/sharedComponents/BidExpiration'
import { formatDifferentialAsCurrency } from '@utils/index'
import { Form, InputNumber } from 'antd'
import { stripLeadingPercentage } from '../Utils/Utils'
import styles from '../styles.module.css'

export function IndexOfferPricing({ form }) {
  const { entryData } = useIndexOffersContext()
  const selectedOffer = entryData?.SelectedIndexOffer

  const contractDifferential = selectedOffer?.ContractDifferential
  const pricingDisplayText = selectedOffer?.PricingDisplayText
  const formulaVariables = (selectedOffer?.FormulaVariables ?? []).filter(
    (v) => v.VariableName !== 'ContractDifferential'
  )
  const isBid = entryData?.IsBid ?? false

  const cardClass = `${styles.differentialCard} ${isBid ? styles.differentialCardBid : styles.differentialCardMarket}`
  const footerClass = `${styles.formulaFooter} ${isBid ? styles.formulaFooterBid : styles.formulaFooterMarket}`
  const bidPrice = Form.useWatch('BidPrice', form)
  return (
    <Vertical flex={3} className={styles.columnDivider}>
      <TitleText title={'pricing'} />
      <div className={`my-2 ${styles.formulaContainer}`}>
        <Texto weight={'bold'}>{pricingDisplayText ?? '-'}</Texto>
      </div>
      <div className={`my-4 ${cardClass}`}>
        <Horizontal className={'mb-3'} justifyContent={'space-between'}>
          <Texto category='h5' className={`${styles.differentialCardLabel} `}>
            {isBid ? 'Your Bid Differential' : 'Contract Differential'}
          </Texto>
          {isBid && (
            <GraviButton style={{ pointerEvents: 'none' }} size={'small'} color='primary'>
              BID
            </GraviButton>
          )}
        </Horizontal>
        {isBid ? (
          <Vertical>
            <Form.Item name='BidPrice' className={`mb-0 ${styles.bidDifferentialInput}`}>
              <InputNumber
                placeholder={`${contractDifferential?.toFixed(4)}`}
                precision={4}
                step={0.0001}
                prefix={defaultCurrencySymbol}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Vertical>
        ) : (
          <>
            <Texto category={'h2'} weight={'bold'} className={'my-1'}>
              {formatDifferentialAsCurrency(contractDifferential)}
            </Texto>
            <Texto>per {defaultUnitOfMeasureSymbol}</Texto>
          </>
        )}
      </div>
      {isBid && (
        <BidExpiration
          form={form}
          selectedItemMeta={selectedOffer}
          layout='vertical'
          width={40}
        />
      )}
      <div className={`${styles.formulaComponents} mt-4`}>
        <div className={styles.formulaComponentsHeader}>
          <Texto category={'p2'} weight={'bold'}>
            FORMULA COMPONENTS
          </Texto>
        </div>

        {formulaVariables.map((item, idx) => {
          const isNegative = (item.Percentage ?? 0) < 0
          return (
            <div key={`${item.VariableName ?? idx}-${idx}`} className={styles.formulaComponent}>
              {item.Percentage != null && (
                <Texto
                  weight={'bold'}
                  appearance={isNegative ? 'error' : 'primary'}
                  className={`${styles.formulaPercentage}`}
                >
                  {`${item.Percentage}%`}
                </Texto>
              )}
              <Texto>{stripLeadingPercentage(item.DisplayName)}</Texto>
            </div>
          )
        })}
        <div className={footerClass}>
          <Texto>Contract Differential</Texto>
          <Texto weight='bold' category={'p2'} appearance={isBid ? 'primary' : 'success'}>
            {isBid
              ? bidPrice || bidPrice === 0
                ? fmt.decimal(bidPrice)
                : 'Your Bid'
              : formatDifferentialAsCurrency(contractDifferential)}
          </Texto>
        </div>
      </div>
    </Vertical>
  )
}
