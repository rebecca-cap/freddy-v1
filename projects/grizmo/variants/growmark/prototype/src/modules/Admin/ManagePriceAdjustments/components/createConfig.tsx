export const newPriceAdjustmentCreateConfig = (selectOptions) => {
  return [
    {
      step_title: 'AddNewPriceAdjustmentHeader',
      form_title: 'New Price Adjustment',
      section: [
        {
          name: 'MarketPlatformInstrument',
          fieldLabel: 'Instrument',
          rules: [
            {
              required: true,
              message: 'Instrument is required',
            },
          ],
          input: 'select',
          type: 'text',
          placeholder: 'Select Instrument',
          options: selectOptions?.MarketPlatformInstrumentList.map((item) => item.Text),
          allowClear: true,
        },
        {
          name: 'Product',
          fieldLabel: 'Product',
          rules: [
            {
              required: true,
              message: 'Product is required',
            },
          ],
          input: 'select',
          type: 'text',
          placeholder: 'Select Product',
          options: selectOptions?.ProductList.map((item) => item.Text),
          allowClear: true,
        },
        {
          name: 'Location',
          fieldLabel: 'Location',
          rules: [
            {
              required: true,
              message: 'Location is required',
            },
          ],
          input: 'select',
          type: 'text',
          placeholder: 'Select Location',
          options: selectOptions?.LocationList.map((item) => item.Text),
          allowClear: true,
        },
      ],
    },
  ]
}
