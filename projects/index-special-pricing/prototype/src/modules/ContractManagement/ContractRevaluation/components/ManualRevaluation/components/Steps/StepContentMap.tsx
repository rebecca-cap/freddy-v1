import {
  ContractValuation,
  ExecuteRevaluationRequest,
  GetMetaDataResponse,
  MetadataItem,
  RevaluationPriceChange,
} from '@modules/ContractManagement/ContractRevaluation/api/types'
import { FormInstance } from 'antd'

import { ConfigureRevaluation } from './ConfigureRevaluation/ConfigureRevaluation'
import { RevaluationResults } from './RevaluationResults/RevaluationResults'
import { SelectContractDetails } from './SelectContractDetails/SelectContractDetails'

export interface ManualRevaluationStepProps {
  metadata?: GetMetaDataResponse['Data']
  form: FormInstance
  selectedPriceInstruments: MetadataItem[]
  setSelectedPriceInstruments: React.Dispatch<React.SetStateAction<MetadataItem[]>>
  selectedContractDetails: ContractValuation[]
  setSelectedContractDetails: React.Dispatch<React.SetStateAction<ContractValuation[]>>
  setActiveStepIndex: React.Dispatch<React.SetStateAction<number>>
  selectedDates: Partial<ExecuteRevaluationRequest>
  revaluationResults: RevaluationPriceChange[]
  onClose: () => void
}

export const revaluationStepContentMap: { [key: number]: React.FC<ManualRevaluationStepProps> } = {
  0: ConfigureRevaluation,
  1: SelectContractDetails,
  2: RevaluationResults,
}
