/**
 *  IPFS has two CID formats v0 and v1, v1 supports different encoding options:
 *  We will use CIDv1 for lido vote and CIDv0 base58btc for links in text
 *  CIDv0:
 *    base58btc              Qm
 *  CIDv1:
 *    base1                   0
 *    base2                   1
 *    base8                   7
 *    base10                  9
 *    base16                  f
 *    base32                  b
 *    base32pad               c
 *    base32hex               v
 *    base32hexpad            t
 *    base32z                 h
 *    base58flickr            Z
 *    base58btc               z
 *    base64                  m
 *    base64pad               M
 *    base64url               u
 *    base64urlpad            U
 */

export const REGEX_CID =
  /(Qm[1-9A-HJ-NP-Za-km-z]{44,128}|b[A-Za-z2-7]{58,128})/g

//Similar REGEX_CID, but only for CIDv1 format located in the end of the text
export const REGEX_LIDO_VOTE_CID = /@lidovote:ipfs:(b[A-Za-z2-7]{58,128})\s*$/

//Similar REGEX_CID, but in Markdown code quote
export const REGEX_CID_IN_MD =
  /`(Qm[1-9A-HJ-NP-Za-km-z]{44,128}|b[A-Za-z2-7]{58,128})`/g
