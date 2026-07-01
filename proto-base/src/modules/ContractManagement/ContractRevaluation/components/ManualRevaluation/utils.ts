export interface RevaluationStep {
  title: string
  subtitle?: string
}

export const revaluationSteps: RevaluationStep[] = [
  {
    title: 'Configure Revaluation',
    subtitle: 'Choose the revaluation window, publisher, and affected instruments',
  },
  {
    title: 'Select Contract Details',
    subtitle: 'Choose contract details to revalue based on your selections',
  },
  {
    title: 'Revaluation Results',
  },
]
