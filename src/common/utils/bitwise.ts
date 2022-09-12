export function checkBit(binary: number, position: number) {
  return ((binary >> position) & 0b1) === 1;
}

export function setBit(binary: number, position: number) {
  return binary | (0b1 << position);
}

export function unsetBit(binary: number, position: number) {
  return binary & ~(0b1 << position);
}
