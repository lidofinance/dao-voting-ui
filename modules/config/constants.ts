import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { ipfsMode } = publicRuntimeConfig

export const IPFS_MODE = ipfsMode === 'true'
