import { Texto, Vertical } from '@gravitate-js/excalibrr'
import { TemplateSelectorMetadata } from '@modules/FormulaTemplates/Api/templateSelectorTypes'
import { FormulaTemplateDetails } from '@modules/FormulaTemplates/Api/types.schema'
import { useMemo } from 'react'

import { TruncatedText } from './TruncatedText'

interface CardMetadataProps {
  template: FormulaTemplateDetails
  metadata?: TemplateSelectorMetadata
}

export function CardMetadata({ template, metadata }: CardMetadataProps) {
  const productNames = useMemo(() => {
    if (!metadata?.ProductList || !template.FormulaTemplateApplicableProducts?.length) return []
    return template.FormulaTemplateApplicableProducts.map(
      (templateProduct) =>
        metadata.ProductList.find((product) => String(product.Value) === String(templateProduct.ProductId))?.Text
    )
  }, [template.FormulaTemplateApplicableProducts, metadata?.ProductList])

  const locationNames = useMemo(() => {
    if (!metadata?.LocationList || !template.FormulaTemplateApplicableLocations?.length) return []
    return template.FormulaTemplateApplicableLocations.map(
      (templateLocation) =>
        metadata.LocationList.find((location) => String(location.Value) === String(templateLocation.LocationId))?.Text
    )
  }, [template.FormulaTemplateApplicableLocations, metadata?.LocationList])

  return (
    <Vertical className='template-card-metadata gap-8'>
      <Vertical className='gap-4'>
        <Texto appearance='medium' weight='600' className={'text-10'}>
          Category:
        </Texto>
        <Texto className={'text-11'}>{template.FormulaTemplateCategoryDisplay}</Texto>
      </Vertical>

      <Vertical className='gap-4'>
        <Texto appearance='medium' weight='600' className={'text-10'}>
          Products:
        </Texto>
        <TruncatedText text={productNames.length > 0 ? productNames.join(', ') : 'N/A'} className='text-11' />
      </Vertical>

      <Vertical className='gap-4'>
        <Texto appearance='medium' weight='600' className={'text-10'}>
          Location:
        </Texto>
        <TruncatedText text={locationNames.length > 0 ? locationNames.join(', ') : 'N/A'} className='text-11' />
      </Vertical>
    </Vertical>
  )
}
