export const formatNumber = (n: number, d: number) =>
  Number(n.toFixed(d)).toLocaleString('en-US')
