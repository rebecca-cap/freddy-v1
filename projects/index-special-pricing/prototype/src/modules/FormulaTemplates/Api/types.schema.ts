import { MetadataItem } from '@api/usePriceEngineFormulas/types'
import type { components } from '@hooks/useTypedApi'

export type FormulaTemplateApplicableLocation =
  components['schemas']['DtoClasses.FormulaTemplateDDTOTypes.FormulaTemplateApplicableLocationDDTO']

export type FormulaTemplateApplicableProduct =
  components['schemas']['DtoClasses.FormulaTemplateDDTOTypes.FormulaTemplateApplicableProductDDTO']

export type FormulaTemplateDetails = components['schemas']['CoreModel.DtoClasses.FormulaTemplateDDTO']

export type FormulaTemplateVariable =
  components['schemas']['DtoClasses.FormulaTemplateDDTOTypes.FormulaTemplateVariableDDTO']

// FE augments the BE marker list item with MetadataItem-shape aliases for
// consumers that expect the legacy `Text`/`Value`/`GroupingValue` triple.
// The BE type already provides those fields, so the intersection is a no-op
// at runtime — kept as an explicit intersection so the `MetadataItem`
// contract is enforced against the BE shape.
export type FormulaTemplateMarkerOption = MetadataItem &
  components['schemas']['Formula.Models.MarkerSelectListItem']

export type FormulaTemplateMetadata =
  components['schemas']['Formula.Models.FormulaTemplateManagementMetaDataResult']
