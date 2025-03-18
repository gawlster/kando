export function isWithinRange(a: number, b: number, range: number) {
  return Math.abs(a - b) < range;
}
