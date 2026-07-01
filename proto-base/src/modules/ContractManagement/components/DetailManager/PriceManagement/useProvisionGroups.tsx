import { useEffect, useState } from 'react'

import { groupInList, ProvisionTypes } from '../../../utils'
import { blankFormulaPrice } from '../../../utils/blankItems'

export function useProvisionGroups(data) {
  const [groups, setGroups] = useState([])
  useEffect(() => {
    if (data?.ProvisionType) {
      const fixedVariables = setupPrices()
      setGroups(groupInList(fixedVariables, data?.ProvisionType === ProvisionTypes.INTEGRATED))
    }
  }, [data?.ProvisionType])

  // can all go in the hook as well
  const getVarGroup = (string: string) => string.split('_')[3]
  const numberOfGroups = (type) => (type === ProvisionTypes.FORMULA ? 1 : type === ProvisionTypes.LESSEROF2 ? 2 : 3)

  const setupPrices = () => {
    const initialGroups = groupInList(data?.Formula?.FormulaVariables, data.ProvisionType === ProvisionTypes.INTEGRATED)
    const correctGroups = numberOfGroups(data.ProvisionType)
    const copy = { ...data }
    let newVariables = []

    if (
      // from Fixed price to Formula Types
      data.Formula.FormulaVariables.length === 1 &&
      initialGroups.length === 0
    ) {
      if (correctGroups > 1) newVariables.push(blankFormulaPrice('var_1_group_2'))
      if (correctGroups > 2) newVariables.push(blankFormulaPrice('var_1_group_3'))
    }

    if (initialGroups.length < correctGroups) {
      newVariables = [...data.Formula.FormulaVariables]
      // formula -> lesser of 2

      if (data.ProvisionType === ProvisionTypes.FORMULA) {
        newVariables.push(blankFormulaPrice('var_1_group_1'))
      }
      if (data.ProvisionType === ProvisionTypes.LESSEROF2) {
        if (initialGroups.length === 0) {
          newVariables.push(blankFormulaPrice('var_1_group_1'))
        }
        newVariables.push(blankFormulaPrice('var_1_group_2'))
      }
      if (data.ProvisionType === ProvisionTypes.LESSEROF3) {
        if (initialGroups.length === 0) {
          newVariables.push(blankFormulaPrice('var_1_group_1'))
          newVariables.push(blankFormulaPrice('var_1_group_2'))
        }
        if (initialGroups.length === 1) {
          newVariables.push(blankFormulaPrice('var_1_group_2')) // formula -> lesserof3
        }
        newVariables.push(blankFormulaPrice('var_1_group_3')) // lesserof2 -> lesserof3
      }
    } else {
      if (data.ProvisionType === ProvisionTypes.FORMULA) {
        newVariables = copy.Formula.FormulaVariables.filter((variable) => getVarGroup(variable.VariableName) === '1')
      }
      if (data.ProvisionType === ProvisionTypes.LESSEROF2) {
        newVariables = copy.Formula.FormulaVariables.filter(
          (variable: { VariableName: any }) =>
            getVarGroup(variable.VariableName) === '1' || getVarGroup(variable.VariableName) === '2'
        )
      }
      if (data.ProvisionType === ProvisionTypes.LESSEROF3) {
        newVariables = copy.Formula.FormulaVariables.filter(
          (variable: { VariableName: any }) =>
            getVarGroup(variable.VariableName) === '1' ||
            getVarGroup(variable.VariableName) === '2' ||
            getVarGroup(variable.VariableName) === '3'
        )
      }
      if (data.ProvisionType === ProvisionTypes.INTEGRATED) {
        newVariables = copy.Formula.FormulaVariables
      }
    }
    return newVariables
  }

  const getUniqueVarName = (variableNames) => {
    const groupName = variableNames.length > 0 ? variableNames[0].split('_')[3] : '1'
    const varName = `var_${variableNames.length}_group_${groupName}`
    const item = variableNames.find((variable) => variable.VariableName === varName)
    if (!item) return varName
    return getUniqueVarName([...variableNames, varName])
  }

  return {
    groups,
    setGroups,
  }
}
