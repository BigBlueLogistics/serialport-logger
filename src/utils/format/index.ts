class Format {
  isValidPalletNo(palletNo: string) {
    const pattern = /^9\d+/i;
    return pattern.test(palletNo);
  }

  isEmpty(value: string) {
    const pattern = /./i;
    return !pattern.test(value);
  }
}

const format = new Format();
export default format;
