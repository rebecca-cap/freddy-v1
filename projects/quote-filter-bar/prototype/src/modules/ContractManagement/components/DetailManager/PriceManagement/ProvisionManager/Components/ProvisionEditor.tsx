import '../../../../../styles.css'

import { Horizontal, Texto, Vertical } from '@gravitate-js/excalibrr'
import { ContractManagementMetadata, Price } from '@modules/ContractManagement/api/types.schema'
import { ProvisionType } from '@modules/ContractManagement/components/DetailManager/PriceManagement/priceColDefs'
import { FormulaGroup } from '@modules/ContractManagement/components/DetailManager/PriceManagement/ProvisionManager/Components/FormulaGroup'
import { VariableColumnHeader } from '@modules/ContractManagement/components/DetailManager/PriceManagement/ProvisionManager/Components/VariableColumnHeader'
import { Form, Input } from 'antd'
import { FormInstance } from 'antd/lib/form/Form'
import moment from 'moment'
import React, { useEffect } from 'react'

import { useProvisionGroups } from '../../useProvisionGroups'

interface ProvisionEditorProps {
  form: FormInstance
  data?: Price
  onSave: (values: Price) => void
  metadata?: ContractManagementMetadata
  viewTemplateChooser: (x: number) => void
  handleSaveAsTemplate: (x: any) => void
}
export function ProvisionEditor({
  form,
  data,
  onSave,
  metadata,
  viewTemplateChooser,
  handleSaveAsTemplate,
}: ProvisionEditorProps) {
  const provisionGroupManager = useProvisionGroups(data)
  useEffect(() => {
    form.setFieldsValue({ Groups: [...provisionGroupManager.groups], Name: data?.Formula?.Name })
  }, [provisionGroupManager.groups])

  if (!data) return null

  return (
    <Form className='provision-editor-form' form={form} onFinish={onSave}>
      <Horizontal className='provision-editor-header'>
        <Vertical>
          <PriceDisplay data={data} />
          <Horizontal className='py-2 px-5' justifyContent='space-between' verticalCenter>
            <Texto category='h6'>Price Formulas</Texto>
            <ProvisionType value={data.ProvisionType} />
          </Horizontal>
          <Horizontal verticalCenter className='py-2 px-5' style={{ width: '100%' }}>
            <Texto category='h6' className='mr-2'>
              Name:
            </Texto>
            <Form.Item name='Name' style={{ width: '100%' }}>
              <Input showCount placeholder='Enter Name' style={{ width: '100%' }} maxLength={255} />
            </Form.Item>
          </Horizontal>
          <VariableColumnHeader />
        </Vertical>
      </Horizontal>
      <Horizontal>
        <Vertical className='provision-editor-body'>
          <Form.List name='Groups'>
            {(formulaGroups) =>
              formulaGroups.map((group) => (
                <FormulaGroup
                  key={group.name}
                  group={group}
                  metadata={metadata}
                  data={data}
                  form={form}
                  viewTemplateChooser={viewTemplateChooser}
                  handleSaveAsTemplate={handleSaveAsTemplate}
                />
              ))
            }
          </Form.List>
        </Vertical>
      </Horizontal>
    </Form>
  )
}

function PriceDisplay({ data }) {
  const effectiveDatesValue = `${moment(data?.FromDate).format('L')} - ${moment(data?.ToDate).format('L')}`
  const currencyValue = data?.CurrencyName
  const unitOfMeasureValue = data?.UnitOfMeasureName
  const payOrReceiveValue = data?.PayOrReceiveCodeValueDisplay
  const volumeBasisValue = data?.NetOrGrossCodeValueDisplay

  return (
    <Horizontal className='bg-theme2 py-3 px-5' style={{ borderRadius: '6px 6px 0 0 ', width: '100%' }}>
      <DataField label='Effective Dates' value={effectiveDatesValue} />
      <DataField label='Currency' value={currencyValue} />
      <DataField label='Unit Of Measure' value={unitOfMeasureValue} />
      <DataField label='Pay / Receive' value={payOrReceiveValue} />
      <DataField label='Volume Basis' value={volumeBasisValue} />
    </Horizontal>
  )
}

function DataField({ label, value }) {
  return (
    <Vertical flex={1} verticalCenter className='mr-3'>
      <Texto appearance='light' textTransform='uppercase'>
        {label}
      </Texto>
      <Texto appearance='white' category='h5' textTransform='uppercase'>
        {value}
      </Texto>
    </Vertical>
  )
}
