import { CreateCompetitorBenchmarkPayload } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/api/schema.types'
import { CompetitorTypes } from '@modules/PricingEngine/Calculations/ManageQuoteRows/Tabs/ManageBenchmarkCorrelations/components/CreateBenchmark/types/page.types'
import type { FormInstance } from 'antd'

interface onCompetitorListChangedProps {
  allValues: any
  changedValues: any
  form: FormInstance
  setMaxAvailable: React.Dispatch<React.SetStateAction<number>>
}
export function onCompetitorListChanged({
  allValues,
  changedValues,
  form,
  setMaxAvailable,
}: onCompetitorListChangedProps) {
  if (allValues.Competitors.length > 0) {
    const used = allValues.Competitors.reduce(
      (acc: number, curr: any) => (typeof curr.Percentage === 'number' ? acc + curr.Percentage : acc),
      0
    )
    const newMaxAvailable = 100 - used
    if (newMaxAvailable >= 0) {
      setMaxAvailable(newMaxAvailable)
    } else {
      const changedIndex = changedValues.Competitors.length - 1
      const totalWithoutNewValue = allValues.Competitors.reduce(
        (acc: number, curr: any, index: number) => (index === changedIndex ? acc : acc + curr.Percentage),
        0
      )
      const newValue = 100 - totalWithoutNewValue
      form.setFieldsValue({
        Competitors: allValues.Competitors.map((competitor: any, index: number) => {
          if (index === changedIndex) {
            return { ...competitor, Percentage: newValue }
          }
          return competitor
        }),
      })
    }
  }
}
interface constructCompetitorPayloadProps {
  values: any
  baseObject: any
  selectedCompetitorType: CompetitorTypes
}
export function constructCompetitorPayload({
  values,
  baseObject,
  selectedCompetitorType,
}: constructCompetitorPayloadProps): CreateCompetitorBenchmarkPayload {
  const competitorPayload = { ...baseObject } as CreateCompetitorBenchmarkPayload
  if (selectedCompetitorType === 'Single') {
    competitorPayload.Competitors = [
      {
        PricePublisherId: values.PricePublisherId,
        CounterPartyId: values.CounterPartyId,
        Percentage: 100,
      },
    ]
  } else {
    competitorPayload.Competitors = values.Competitors.map((competitor: any) => ({
      PricePublisherId: competitor.PricePublisherId,
      CounterPartyId: competitor.CounterPartyId,
      Percentage: competitor.Percentage,
    }))
  }
  return competitorPayload
}
export function constructBaseObject(values: any) {
  const diff =
    values.DifferentialAmount > 0 && values.DifferentialSign === '-'
      ? -values.DifferentialAmount
      : values.DifferentialAmount
  return {
    Differential: diff,
    Name: values.Name,
    ProductHierarchyId: values.ProductHierarchyId,
    LocationHierarchyId: values.LocationHierarchyId,
  }
}
