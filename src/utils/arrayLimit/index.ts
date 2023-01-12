export default function arrayLimit(limit: number, data: string[]) {
  if (data.length >= limit) {
    // Return the last two elements in array
    // if reach to its limit.
    return data.slice(-2);
  }
  return data;
}
