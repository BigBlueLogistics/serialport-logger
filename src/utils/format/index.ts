class Format {
  isValidPalletNo(palletNo: string) {
    const pattern = /^9\d+/i;
    return pattern.test(palletNo);
  }

  isEmpty(value: string) {
    const pattern = /./i;
    return !pattern.test(value);
  }

  toLowerCase(value: string) {
    if (!value) {
      return "";
    }

    return value
      .toLowerCase()
      .trim()
      .replaceAll(/[\r\n]/gm, "");
  }
}

const format = new Format();
export default format;
