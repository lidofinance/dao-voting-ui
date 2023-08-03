const PATTERN_ETH_ADDRESS = '\\b0x[a-fA-F0-9]{40}\\b'
export const REGEX_ETH_ADDRESS = new RegExp(PATTERN_ETH_ADDRESS, 'g')
export const REGEX_ETH_ADDRESS_ONLY = new RegExp(`^${PATTERN_ETH_ADDRESS}$`)
