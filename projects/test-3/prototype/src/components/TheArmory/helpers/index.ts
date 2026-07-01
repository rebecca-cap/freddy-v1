export const dateFormat = {
  DATE: 'MM-DD-YY', // 03-15-25
  DATE_SLASH: 'MM/DD/YYYY', // 03/15/2025
  TIME: 'h:mm A', // 3:45 PM
  SHORT_TIME: 'h A', // 3 PM
  FULL_TIME: 'hh:mm:ss A', // 03:45:12 PM
  TIME24: 'HH:mm', // 15:45
  DAY: 'ddd', // Sat
  SHORT_DATE_TIME: 'M/D h:mm A', // 3/15 3:45 PM
  DATE_TIME: 'MM-DD-YYYY h:mm A', // 03-15-2025 3:45 PM
  SHORT_DATE_YEAR_TIME: 'MM/DD/YYYY h:mm A', // 03/15/2025 3:45 PM
  MONTH_DATE_TIME: 'MMM D, h:mm A', // Mar 15, 3:45 PM
  MONTH_DATE_YEAR_TIME: 'MMM D, YYYY h:mm A', // Mar 15, 2025 3:45 PM
  MONTH_DATE_YEAR: 'MMM D, YYYY', // Mar 15, 2025
  YEAR_MONTH_DATE: 'YYYY-MM-DD', // 2025-03-15
  DAY_TIME: 'ddd D, h:mm A', // Sat 15, 3:45 PM
  WEEKDAY_MONTH_DATE: 'ddd M/D', // Sat 3/15
  WEEKDAY_MONTH_DATE_TIME: 'ddd M/D h:mm A', // Sat 3/15 3:45 PM
  ISO: 'YYYY-MM-DDTHH:mm:ss', // 2025-03-15T15:45:12
  MONTH_DATE: 'M/DD', // 3/15
  MONTH_DATE_V2: 'MMM DD', // Mar 15
  ISO_V2: 'YYYY-MM-DD HH:mm:ss', // 2025-03-15 15:45:12
  SHORT_DATE_YEAR_TIME_V2: 'MM/DD/YYYY: h:mm A', // 03/15/2025: 3:45 PM
  SHORT_DATE_TIME_COMMA: 'M/D, h:mm A', // 3/15, 3:45 PM
}

export const getComputedStyleValue = (element, property) => {
  return window.getComputedStyle(element).getPropertyValue(property)
}

export const CREDIT_STATUS_APPEARANCE = {
  'Good Standing': 'success',
  'Credit Hold': 'error',
  'Credit Watch': 'warning',
}

export const CREDIT_STATUS_COLOR: Record<string, string> = {
  'Good Standing': 'var(--credit-status-success)',
  'Credit Watch': 'var(--credit-status-warning)',
  'Credit Hold': 'var(--credit-status-danger)',
}
