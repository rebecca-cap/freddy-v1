import { CodeSetResponse } from '../../api/usePricePublishers/responseTypes'

export const createPublisherConfig = (createSelectOptions: { publisherTypes: CodeSetResponse['Data'][number] }) => {
  return [
    {
      step_title: 'Name',
      form_title: 'New Publisher',
      section: [
        {
          name: 'Name',
          placeholder: 'Enter Name',
          input: 'input',
          rules: [
            {
              required: true,
              message: 'Name is required',
            },
          ],
        },
        {
          name: 'Abbreviation',
          input: 'input',
          max: 1000,
          min: 0,
          precision: 0,
          placeholder: 'Enter abbreviation',
          rules: [
            {
              required: true,
              message: 'Abbreviation required',
            },
          ],
        },
        {
          name: 'PricePublisherTypeCvId',
          fieldLabel: 'Publisher Type',
          input: 'select',
          placeholder: 'Select Publisher Type',
          options: createSelectOptions?.publisherTypes?.CodeValues?.map((v) => v.Display),
        },
        {
          name: 'IsActive',
          fieldLabel: 'Active',
          input: 'select',
          type: 'single',
          placeholder: 'Yes or No',
          options: ['Yes', 'No'],
          rules: [
            {
              required: true,
              message: 'Value required',
            },
          ],
        },
      ],
    },
  ]
}
