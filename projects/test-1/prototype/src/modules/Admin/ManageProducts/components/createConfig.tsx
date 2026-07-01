export const newProductCreateConfig = () => {
  return [
    {
      step_title: 'AddNewProduct',
      form_title: 'New Product',
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
