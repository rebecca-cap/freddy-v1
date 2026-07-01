export const newCalendarCreateConfig = () => [
  {
    step_title: 'AddNewCalendar',
    form_title: 'New Calendar',
    section: [
      {
        name: 'CalendarName',
        fieldLabel: 'Calendar Name',
        type: 'text',
        input: 'input',
        placeholder: 'Enter Calendar Name',
        rules: [
          {
            required: true,
            message: 'Calendar Name is required',
          },
        ],
      },
    ],
  },
]
