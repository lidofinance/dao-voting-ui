const basePath = process.env.BASE_PATH || ''
const infuraApiKey = process.env.INFURA_API_KEY
const alchemyApiKey = process.env.ALCHEMY_API_KEY

const rpcUrls_1 = (process.env.EL_RPC_URLS_1 &&
  process.env.EL_RPC_URLS_1.split(',')) || [
  alchemyApiKey ?? `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`,
  infuraApiKey ?? `https://mainnet.infura.io/v3/${infuraApiKey}`,
].filter(Boolean);

const rpcUrls_5 = (process.env.EL_RPC_URLS_5 &&
  process.env.EL_RPC_URLS_5.split(',')) || [
  alchemyApiKey ?? `https://eth-goerli.alchemyapi.io/v2/${alchemyApiKey}`,
  infuraApiKey ?? `https://goerli.infura.io/v3/${infuraApiKey}`,
].filter(Boolean);

const etherscanApiKey = process.env.ETHERSCAN_API_KEY

const defaultChain = process.env.DEFAULT_CHAIN || '1'
const supportedChains = process.env.SUPPORTED_CHAINS || '1,4,5'

const cspTrustedHosts = process.env.CSP_TRUSTED_HOSTS
const cspReportOnly = process.env.CSP_REPORT_ONLY
const cspReportUri = process.env.CSP_REPORT_URI

const ipfsMode = process.env.IPFS_MODE
const walletconnectProjectId = process.env.WALLETCONNECT_PROJECT_ID

export default {
  basePath,
  webpack5: true,
  experimental: {
    // Fixes a build error with importing Pure ESM modules, e.g. reef-knot
    // Some docs are here:
    // <https://github.com/vercel/next.js/pull/27069>
    // You can see how it is actually used in v12.3.4 here:
    // <https://github.com/vercel/next.js/blob/v12.3.4/packages/next/build/webpack-config.ts#L417>
    // Presumably, it is true by default in next v13 and won't be needed
    esmExternals: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg.react$/i,
      issuer: { and: [/\.(js|ts|md)x?$/] },
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            prettier: false,
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false,
                },
              ],
            },
            titleProp: true,
          },
        },
      ],
    })

    config.module.rules.push({
      test: /\.(t|j)sx?$/,
      use: [
        {
          loader: 'webpack-preprocessor-loader',
          options: {
            params: {
              IPFS_MODE: String(ipfsMode === 'true'),
            },
          },
        },
      ],
    })

    return config
  },
  // WARNING: Vulnerability fix, don't remove until default Next.js image loader is patched
  images: {
    loader: 'custom',
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'same-origin',
          },
        ],
      },
    ]
  },
  devServer(configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost)

      config.headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers':
          'X-Requested-With, content-type, Authorization',
      }

      return config
    }
  },
  serverRuntimeConfig: {
    basePath,
    rpcUrls_1,
    rpcUrls_5,
    etherscanApiKey,
    cspTrustedHosts,
    cspReportOnly,
    cspReportUri,
  },
  publicRuntimeConfig: {
    defaultChain,
    supportedChains,
    ipfsMode,
    walletconnectProjectId,
  },
}
