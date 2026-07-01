export const PEFormulaTemplateEndpoints = {
  saveFormulaTemplate: 'FormulaTemplateManagement/UpsertFormulaTemplate',
  deleteFormulaTemplate: 'FormulaTemplateManagement/DeleteFormulaTemplates',
  getAllFormulaTemplates: 'FormulaTemplateManagement/GetAll',
  metadata: 'FormulaTemplateManagement/Metadata',
  rawMetadata: 'FormulaTemplateManagement/RawMetadata',
}

export const OSPFormulaTemplateEndpoints = {
  saveFormulaTemplate: 'MarketPlatform/ContractTemplates/UpsertFormulaTemplate',
  deleteFormulaTemplate: 'MarketPlatform/ContractTemplates/DeleteFormulaTemplates',
  getAllFormulaTemplates: 'MarketPlatform/ContractTemplates/GetAll',
  metadata: 'MarketPlatform/ContractTemplates/Metadata',
  rawMetadata: 'MarketPlatform/ContractTemplates/RawMetadata',
}

export type FormulaTemplateEndpoints = typeof PEFormulaTemplateEndpoints
