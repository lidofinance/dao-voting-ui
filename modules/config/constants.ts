import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const { ipfsMode, basePath = '' } = publicRuntimeConfig

export const IPFS_MODE = ipfsMode === 'true'
export const BASE_PATH_ASSET = IPFS_MODE ? '.' : basePath
