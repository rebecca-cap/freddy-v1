import { BoxTagFilled } from '@assets/icons/BoxTagFilled'
import { BoxTagOutlined } from '@assets/icons/BoxTagOutlined'
import { GavelIconFilled } from '@assets/icons/GavelIconFilled'
import { GavelIconOutlined } from '@assets/icons/GavelIconOutlined'
import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { SpecialOfferTemplate } from '@modules/Dashboard/SpecialOffers/Api/types.schema'
import { DealSelectionButtons } from '@modules/Dashboard/SpecialOffers/Components/CreateNew/Components/DealSelectionButtons'
import { useMemo } from 'react'

interface SelectDealTypeProps {
  handleSelectCategory: (category: string) => void
  selectedCategory: string | undefined
  handleSelectTemplate: (id: number) => void
  selectedTemplateId: number | undefined
  categories: { id: string; label: string; description: string }[]
  templates: SpecialOfferTemplate[]
}

export function SelectDealType({
  handleSelectCategory,
  selectedCategory,
  handleSelectTemplate,
  selectedTemplateId,
  categories,
  templates,
}: SelectDealTypeProps) {
  const categoryItems = useMemo(
    () =>
      categories.map((cat) => ({
        id: cat.id,
        label: cat.label,
        description: cat.description,
        icon:
          cat.id === 'auction' ? (
            <GavelIconOutlined style={{ fontSize: '48px' }} />
          ) : (
            <BoxTagOutlined style={{ fontSize: '48px' }} />
          ),
        iconSelected:
          cat.id === 'auction' ? (
            <GavelIconFilled style={{ fontSize: '48px', color: 'var(--theme-color-1' }} />
          ) : (
            <BoxTagFilled style={{ fontSize: '48px', color: 'var(--theme-color-1' }} />
          ),
      })),
    [categories]
  )

  const templateItems = useMemo(
    () =>
      templates.map((t) => ({
        id: t.SpecialOfferTemplateId,
        label: t.Name,
        description: t.Description,
      })),
    [templates]
  )

  return (
    <Vertical className={'p-4'} justifyContent='space-between'>
      <Vertical className={'gap-10'} flex={1}>
        <Texto category={'h4'} className={'text-18'}>
          What type of offer do you want to create?
        </Texto>
        <Texto className={'text-14'}>Choose how you want to sell your fuel inventory</Texto>
      </Vertical>

      <Horizontal className={'mt-1'} flex={2} style={{ gap: '16px' }}>
        {categoryItems.map((item) => (
          <DealSelectionButtons
            key={item.id}
            selectedId={selectedCategory}
            onSelect={(id) => handleSelectCategory(id as string)}
            item={item}
            variant='deal'
          />
        ))}
      </Horizontal>

      <Vertical className={'mt-4 mb-2'}>
        <Texto category={'h4'}>Template</Texto>
      </Vertical>
      <Horizontal verticalCenter flex={1} style={{ gap: '16px', flexWrap: 'wrap' }}>
        {templateItems.map((item) => (
          <DealSelectionButtons
            key={item.id}
            selectedId={selectedTemplateId}
            onSelect={(id) => handleSelectTemplate(id as number)}
            item={item}
            variant='subtype'
          />
        ))}
      </Horizontal>
    </Vertical>
  )
}
