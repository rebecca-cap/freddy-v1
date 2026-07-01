declare global {
  declare const fmt: {
    currency: (input: number, precisionOverride?: number) => string
    decimal: (input: number, precisionOverride?: number) => string
    integer: (input: number, precisionOverride?: number) => string
    currentPrecision?: number
    marginDecimal: (value: number) => string
  }
}

export {}
