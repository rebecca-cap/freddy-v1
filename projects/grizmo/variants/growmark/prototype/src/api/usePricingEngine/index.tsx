import worksheetData from './dummyData/worksheet.json'

export const usePricingEngine = () => {
  function getPriceWorksheet() {
    return worksheetData
  }

  return { getPriceWorksheet }
}
