export const newDeliveryPeriodConfig = (createSelectOptions) => {
  const { deliveryPeriodGroups, marketPlatformInstrument } = createSelectOptions

  const section = [
    {
      name: 'EffectiveFromDateTime',
      fieldLabel: 'Effective Start',
      type: 'text',
      input: 'date',
      placeholder: 'Select Date',
      rules: [
        {
          required: true,
          message: 'Effective start date is required',
        },
      ],
    },
    {
      name: 'EffectiveToDateTime',
      fieldLabel: 'Effective End',
      type: 'text',
      input: 'date',
      placeholder: 'Select Date',
      rules: [
        {
          required: true,
          message: 'Effective end date is required',
        },
      ],
    },
    {
      name: 'FutureMonth',
      fieldLabel: 'Future Month',
      type: 'text',
      input: 'date',
      placeholder: 'Select Date',
      rules: [
        {
          required: true,
          message: 'Future month date is required',
        },
      ],
    },
    {
      name: 'IsActive',
      fieldLabel: 'Is active?',
      input: 'select',
      placeholder: 'Select status',
      options: ['Active', 'Inactive'],
      rules: [
        {
          required: true,
          message: 'Is active is required',
        },
      ],
    },
  ]

  if (marketPlatformInstrument?.TradeTypeMeaning?.includes('Forward')) {
    section.push(
      {
        name: 'DeliveryPeriodFromDateTime',
        fieldLabel: 'Delivery Start',
        type: 'text',
        input: 'date',
        placeholder: 'Select Date',
        rules: [
          {
            required: true,
            message: 'Delivery start date is required',
          },
        ],
      },
      {
        name: 'DeliveryPeriodToDateTime',
        fieldLabel: 'Delivery End',
        type: 'text',
        input: 'date',
        placeholder: 'Select Date',
        rules: [
          {
            required: true,
            message: 'Delivery end date is required',
          },
        ],
      },
      {
        name: 'DeliveryPeriodName',
        fieldLabel: 'Delivery Period Name',
        type: 'text',
        input: 'input',
        placeholder: 'Enter Name',
        rules: [
          {
            required: true,
            message: 'Name is required',
          },
        ],
      }
    )
  }

  if (marketPlatformInstrument?.HasDeliveryPeriodGroups) {
    section.push({
      name: 'DeliveryPeriodGroup',
      fieldLabel: 'Delivery Period Group',
      input: 'select',
      placeholder: 'Select delivery period group',
      options: deliveryPeriodGroups?.map((g) => g.Text),
    })
  }

  return [
    {
      step_title: 'CreateNewDeliveryPeriod',
      form_title: 'New Delivery Period',
      section,
    },
  ]
}
