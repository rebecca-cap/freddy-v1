export const newNetGrossRuleCreateConfig = (createSelectOptions) => {
  const {
    LocationList,
    ProductList,
    CounterPartyList,
    QuoteConfigurationList,
    NetOrGrossTypeList,
    NetOrGrossDefaultTypeList,
    TradeEntryTypeList,
    netOrGrossDefaultTypeCvId,
  } = createSelectOptions

  const NetGrossDefaultType = NetOrGrossDefaultTypeList.find((option) => option.Value === netOrGrossDefaultTypeCvId)

  const section = []

  section.push(
    {
      name: 'Location',
      type: 'text',
      input: 'select',
      placeholder: 'Select location',
      allowClear: true,
      rules: [
        {
          required: true,
          message: 'Location is required',
        },
      ],
      options: LocationList?.map((g) => g.Text),
    },
    {
      name: 'Product',
      type: 'text',
      input: 'select',
      placeholder: 'Select product',
      allowClear: true,
      options: ProductList?.map((g) => g.Text),
    },
    {
      name: 'Counterparty',
      type: 'text',
      input: 'select',
      placeholder: 'Select counterparty',
      allowClear: true,
      options: CounterPartyList?.map((g) => g.Text),
    },
    {
      fieldLabel: 'Net / Gross',
      name: 'NetGross',
      type: 'text',
      input: 'select',
      placeholder: 'Select net or gross',
      allowClear: true,
      rules: [
        {
          required: true,
          message: 'Net / Gross is required',
        },
      ],
      options: NetOrGrossTypeList?.map((g) => g.Text),
    }
  )

  if (NetGrossDefaultType?.Text === 'Contract') {
    section.push({
      fieldLabel: 'Deal Type',
      name: 'TradeEntryType',
      type: 'text',
      input: 'select',
      placeholder: 'Select deal type',
      allowClear: true,
      options: TradeEntryTypeList?.map((g) => g.Text),
    })
  }

  if (NetGrossDefaultType?.Text === 'Quote Entry') {
    section.push({
      fieldLabel: 'Quote Configuration',
      name: 'QuoteConfiguration',
      type: 'text',
      input: 'select',
      placeholder: 'Select quote configuration',
      allowClear: true,
      options: QuoteConfigurationList?.map((g) => g.Text),
    })
  }

  return [
    {
      step_title: 'AddNewRule',
      form_title: 'New Rule',
      section,
    },
  ]
}
