import { FormulaHeader } from '@modules/ContractManagement/components/DetailManager/PriceManagement/ProvisionManager/Components/FormulaHeader'
import { VariableRowForm } from '@modules/ContractManagement/components/DetailManager/PriceManagement/ProvisionManager/Components/VariableRowForm'
import { useProvisionGroups } from '@modules/ContractManagement/components/DetailManager/PriceManagement/useProvisionGroups'
import { blankFormulaPrice } from '@modules/ContractManagement/utils/blankItems'
import { Form } from 'antd'
import React from 'react'

export function FormulaGroup({ group, metadata, data, form, viewTemplateChooser, handleSaveAsTemplate }) {
  const { groups } = useProvisionGroups(data)
  return (
    <Form.List name={group.name}>
      {(variables, { add, remove }) => {
        return (
          <>
            <FormulaHeader
              index={group.name}
              addFormula={() => add(blankFormulaPrice())}
              viewTemplateChooser={() => viewTemplateChooser(group.name)}
              handleSaveAsTemplate={() => handleSaveAsTemplate(group.name)}
            />
            {variables.map((variable, variableIndex) => (
              <VariableRowForm
                form={form}
                metadata={metadata}
                variable={groups[group.name]?.[variableIndex]}
                variableIndex={variableIndex}
                remove={() => remove(variable.name)}
                key={`group-${group.name}-variablerow-${variableIndex}`}
                name={variable.name}
                groupName={group.name}
                data={data}
              />
            ))}
          </>
        )
      }}
    </Form.List>
  )
}
