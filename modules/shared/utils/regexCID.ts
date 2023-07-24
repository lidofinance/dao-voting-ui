/**
 *  IPFS has 2 cid formats v0 and v1, v1 supports different encoding options:
 *  CIDv0:
 *    base58btc              Qm
 *  CIDv1:
 *    base16                 f
 *    base16upper            F
 *    hexadecimal base32     b
 *    base32upper            B
 *    base58btc              z
 *    base64                 m
 *    base64url              u
 *    base64urlpad           U
 */

export const REGEX_CID =
  /(Qm[1-9A-HJ-NP-Za-km-z]{44,128}|b[A-Za-z2-7]{58,128}|B[A-Z2-7]{58,128}|z[1-9A-HJ-NP-Za-km-z]{48,128}|F[0-9A-F]{50,128})/g
