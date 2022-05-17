/** Shifte Bits zur Position n und Maskiere mit 0b1 um diese Position zu prüfen */
export function checkBit(binary: number, n: number) {
  return ((binary >> n) & 0b1) === 1;
}
