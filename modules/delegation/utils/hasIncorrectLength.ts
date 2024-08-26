export const hasIncorrectLength = (address: string) =>
  ![40, 42].includes(`${address}`.length)
