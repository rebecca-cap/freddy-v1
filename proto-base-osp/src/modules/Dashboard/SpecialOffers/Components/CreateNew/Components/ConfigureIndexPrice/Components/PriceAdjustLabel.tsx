interface PriceAdjustLabelProps {
  isAuction: boolean
  differentialLabel?: string
}

export function PriceAdjustLabel({ isAuction, differentialLabel = 'Differential' }: PriceAdjustLabelProps) {
  if (isAuction) {
    return (
      <>
        Reserve Price&nbsp;<i>(Target customer-submitted differential to formula price)</i>
      </>
    )
  }
  return <>{differentialLabel}</>
}
