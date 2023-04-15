class Money {
  static toCents(decimalValue: number) {
    return decimalValue * 100;
  }

  static toDecimalValue(valueInCents: number) {
    return parseFloat((valueInCents / 100).toFixed(2));
  }
}

export default Money;
