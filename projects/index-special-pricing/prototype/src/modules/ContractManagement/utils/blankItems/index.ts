import { Detail } from '@modules/ContractManagement/api/types.schema'
import moment from 'moment/moment'

export const blankDetail = () => ({
  FrequencyCodeValueDisplay: null,
  FrequencyCvId: null,
  FromDateTime: moment(),
  FromLocationId: null,
  FromLocationName: null,
  NetOrGrossCodeValueDisplay: null,
  NetOrGrossCvId: null,
  Prices: [],
  ProductId: null,
  ProductName: null,
  Quantity: null,
  ToDateTime: moment(),
  EffectiveDates: [moment(), moment()],
  ToLocationId: null,
  ToLocationName: null,
  TradeEntryDetailId: '',
  LocalTradeEntryDetailId: '',
  UnitOfMeasureId: null,
  UnitOfMeasureName: null,
  isOpen: true,
  Quantities: [],
})

const caseInsensitiveIncludes = (sub: string, query: string) => sub.toLowerCase().includes(query.toLowerCase().trim())

export const blankFixedProvision = (managedDetail: Detail, metadata) => {
  const defaultCurrency = metadata?.CurrencyList?.find((o) => caseInsensitiveIncludes(o.Text, 'us dollar'))
  const defaultUOM = metadata?.UnitOfMeasureList?.find((o) => caseInsensitiveIncludes(o.Text, 'gal'))
  const defaultPay = metadata?.PayOrReceiveTypeList?.find((o) => caseInsensitiveIncludes(o.Text, 'pay'))
  return {
    CurrencyId: defaultCurrency?.Value,
    CurrencyName: defaultCurrency?.Text,
    FromDate: managedDetail?.EffectiveDates?.[0],
    PayOrReceiveCodeValueDisplay: defaultPay?.Text,
    PayOrReceiveCvId: defaultPay.PayOrReceiveCvId,
    ToDate: managedDetail?.EffectiveDates?.[1],
    UnitOfMeasureId: defaultUOM?.Value,
    UnitOfMeasureName: defaultUOM?.Text,
    LocalTradeEntryPriceId: crypto.randomUUID(),
    Formula: {
      FormulaId: 0, // this is 0 if it's a new formula, if it's not the ep will return a real number
      FormulaVariables: [
        {
          DisplayName: 'Fixed Price', // this can be whatever you want
          FixedValue: 'Needs Price', // the fixed value for the variable goes here
          PriceTypeCvId: 704, // this may be nullable but I'm not 100% sure
          ValueSourceCvId: 7203, // indicates we use the "fixed" value
          VariableName: 'var_1',
        },
      ],
      Formula: 'var_1', // this is the formula that gets run on the server
      Name: '', // this can be whatever convention you want
      ParserType: '',
    },
    FixedValue: 0,
    Status: 'Needs Price',
    ProvisionType: 'Fixed',
  }
}

export const blankFormulaPrice = (varName?: string) => ({
  AllowMultiOrigin: null,
  FormulaId: 0,
  FormulaVariableId: 0,
  FormulaVariableTemplateId: 0,
  CounterPartyMatchTypeCvId: null,
  CreatedByCredentialId: null,
  CreatedDateTime: new Date(),
  DependentFormulaId: null,
  Differential: null,
  DisplayName: '',
  FixedValue: null,
  IsRequired: true,
  IsSystemVariable: true,
  IsTemplateVariable: null,
  IsVisible: false,
  Percentage: 100,
  PriceInstrumentId: null,
  PriceInstrumentName: null,
  PricePublisherId: null,
  PricePublisherName: null,
  PriceTypeCvId: null,
  PriceValuationRuleId: null,
  PriceValuationRuleImplementation: null,
  PriceValuationRuleName: null,
  PriceValuationRuleSourceId: null,
  SpecificLocationId: null,
  SpecificProductId: null,
  SystemDataType: null,
  TradeDateRuleCvId: null,
  UOMConversionOverride: null,
  ValueEffectiveDateRuleCvId: null,
  ValueSourceCvId: null,
  VariableName: varName ?? '',
})
