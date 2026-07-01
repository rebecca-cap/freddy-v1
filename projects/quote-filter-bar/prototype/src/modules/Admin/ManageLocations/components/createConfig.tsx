export const newLocationCreateConfig = (createSelectOptions) => {
  return [
    {
      step_title: 'AddNewLocation',
      form_title: 'New Location',
      section: [
        {
          name: 'Name',
          type: 'text',
          input: 'input',
          placeholder: 'Enter Name',
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
          name: 'Latitude',
          input: 'inputNumber',
          precision: 6,
          placeholder: 'Enter latitude',
        },
        {
          name: 'Longitude',
          input: 'inputNumber',
          precision: 6,
          placeholder: 'Enter latitude',
        },
        {
          name: 'LocationGroup',
          fieldLabel: 'Location Group',
          input: 'select',
          placeholder: 'Select location group',
          options: createSelectOptions?.LocationGroups.map((g) => g.Text),
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
      ],
    },
  ]
}
