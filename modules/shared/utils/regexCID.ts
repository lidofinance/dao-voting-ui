/**
 *  https://github.com/multiformats/multibase/blob/master/multibase.csv
 *  IPFS has two CID formats v0 and v1, v1 supports different encodings, defaults are:
 *  CIDv0:
 *    base58btc              Qm ✓ QmRKs2ZfuwvmZA3QAWmCqrGUjV9pxtBUDP3wuc6iVGnjA2
 *  CIDv1:
 *    base16                  f ✓ f017012202c5f688262e0ece8569aa6f94d60aad55ca8d9d83734e4a7430d0cff6588ec2b
 *    base16upper             F ✓ F017012202C5F688262E0ECE8569AA6F94D60AAD55CA8D9D83734E4A7430D0CFF6588EC2B
 *    base32upper             B ✓ BAFYBEIBML5UIEYXA5TUFNGVG7FGWBKWVLSUNTWBXGTSKOQYNBT7WLCHMFM
 *    base32                  b ✓ bafybeibml5uieyxa5tufngvg7fgwbkwvlsuntwbxgtskoqynbt7wlchmfm
 *    base58btc               z ✓ zdj7WYR7PzjmRQNRsMKuFipiE73MhMGgRbc5hTUaQVPJiMdKx
 *    base64                  m ✓ mAXASICxfaIJi4OzoVpqm+U1gqtVcqNnYNzTkp0MNDP9liOwr
 *    base64url               u ✓ uAXASICxfaIJi4OzoVpqm-U1gqtVcqNnYNzTkp0MNDP9liOwr
 *    base64urlpad            U ✓ UAXASICxfaIJi4OzoVpqm-U1gqtVcqNnYNzTkp0MNDP9liOwr
 *
 *    gateways cid supported types:
 *
 *    b - web3.storage
 *    b, z, Qm - ipfs.io
 *    all - cloudflare-ipfs.com
 *    all - infra.io
 */

const CID_0_58_BTC = 'Qm[1-9A-HJ-NP-Za-km-z]{44,128}'
const CID_1_16 = '[fF][0-9a-zA-F]{50,128}' // case-insensitive
const CID_1_32 = '[bB][A-Za-z2-7]{58,128}' // case-insensitive
const CID_1_58_BTC = 'z[1-9A-HJ-NP-Za-km-z]{48,128}'
const CID_1_64 = 'm[+A-Za-z0-9/]{40,128}'
const CID_1_64_URL = 'u[-A-Za-z0-9_]{40,128}'
const CID_1_64_URLPAD = 'U[-A-Za-z0-9_]{40,128}={0,3}'

const PATTERN_CID = `\\b(${CID_0_58_BTC}|${CID_1_16}|${CID_1_32}|${CID_1_58_BTC}|${CID_1_64}|${CID_1_64_URL}|${CID_1_64_URLPAD})\\b`

export const REGEX_CID = new RegExp(PATTERN_CID, 'g')
export const REGEX_CID_ONLY = new RegExp(`^${PATTERN_CID}$`)

export const REGEX_LIDO_VOTE_CID = new RegExp(
  `\\blidovoteipfs://(${CID_1_32})\\s*$`,
)
