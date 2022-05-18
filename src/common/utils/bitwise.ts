/** Shiftet Bits zur Position `n` und maskiert mit `0b1` um diese zu prüfen */
export function checkBit(binary: number, n: number) {
  return ((binary >> n) & 0b1) === 1;
}
