type Args = {
  floor?: boolean
}

export function formatFloatPct(pct: number, args: Args = {}) {
  if (pct < 0.01) {
    return Math.ceil(pct * 10000) / 100
  } else if (pct > 0.99 || args.floor) {
    return Math.floor(pct * 10000) / 100
  }
  return Math.round(pct * 10000) / 100
}
