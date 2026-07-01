export const createCounterpartyConfig = (selectOptions) => {
  return [
    {
      step_title: 'Counterparty Details',
      form_title: 'Counterparty Details',
      section: [
        {
          name: 'Name',
          type: 'text',
          input: 'input',
          placeholder: 'Enter Name',
          rules: [
            {
              required: true,
              message: 'Counter party name is required',
            },
          ],
        },
        {
          name: 'Abbreviation',
          type: 'text',
          input: 'input',
          placeholder: 'Enter a counter party abbreviation (optional)',
        },
        {
          name: 'CounterPartyCategoryCvId',
          fieldLabel: 'Counterparty Category',
          input: 'select',
          type: 'single',
          placeholder: 'Select Type',
          options: selectOptions?.CounterPartyCategoryList.map((item) => item.Text),
          rules: [
            {
              required: true,
              message: 'Counter party type is required',
            },
          ],
        },
        {
          name: 'PrimaryInternalCounterpartyId',
          fieldLabel: 'Internal Counterparty',
          input: 'select',
          type: 'single',
          placeholder: 'Select Internal Counterparty',
          options: selectOptions?.InternalCounterPartyList.map((item) => item.Text),
        },
        {
          name: 'CreditStatusOverrideCvId',
          fieldLabel: 'Credit Status',
          input: 'select',
          type: 'single',
          placeholder: 'Select Credit Status',
          options: [...(selectOptions?.CreditStatusList.map((item) => item.Text) || []), 'None'],
        },
        {
          name: 'IsActive',
          fieldLabel: 'Active',
          input: 'select',
          type: 'single',
          placeholder: 'Select Status',
          options: ['Yes', 'No'],
          rules: [
            {
              required: true,
              message: 'Status is required',
            },
          ],
        },
        {
          name: 'SourceSystemId',
          input: 'select',
          type: 'single',
          placeholder: 'Select Source System',
          options: selectOptions?.EditableSources?.map((item) => item.Text),
        },
        {
          name: 'SourceIdentifier',
          type: 'text',
          input: 'input',
          placeholder: 'Enter SourceIdentifier',
        },
      ],
    },
  ]
}
