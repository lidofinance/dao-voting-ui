declare module 'ipfs-only-hash' {
  function of(
    text: string,
    params: Record<'cidVersion' | 'rawLeaves' | string, any>,
  )
}
