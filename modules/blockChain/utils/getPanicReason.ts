export function getPanicReason(code: string): string {
  const panicCodes: { [key: string]: string } = {
    '0x01': 'Assertion error',
    '0x11': 'Arithmetic operation underflowed or overflowed',
    '0x12': 'Division or modulo division by zero',
    '0x21':
      'Tried to convert a value into an enum but the value was too big or negative',
    '0x22': 'Accessed storage byte array that is incorrectly encoded',
    '0x31': 'Called .pop() on an empty array',
    '0x32': 'Array index out of bounds',
    '0x41': 'Allocated too much memory or created an array that is too large',
    '0x51': 'Called a zero-initialized variable of internal function type',
  }

  return panicCodes[code] || `Unknown panic code: ${code}`
}
