const basePath = process.env.BASE_PATH || ''

const rpcUrls_1 =
  process.env.EL_RPC_URLS_1 && process.env.EL_RPC_URLS_1.split(',')
const rpcUrls_17000 =
  process.env.EL_RPC_URLS_17000 && process.env.EL_RPC_URLS_17000.split(',')
const rpcUrls_560048 =
  process.env.EL_RPC_URLS_560048 && process.env.EL_RPC_URLS_560048.split(',')

const etherscanApiKey = process.env.ETHERSCAN_API_KEY

// Mainnet is the default chain
const _defaultChain = '1'

// Keep Mainnet, Holesky and Hoodi as defaults
const defaultSupportedChains = '1,17000,560048'

const defaultChain = process.env.DEFAULT_CHAIN || _defaultChain
const supportedChains = process.env.SUPPORTED_CHAINS || defaultSupportedChains

const cspTrustedHosts = process.env.CSP_TRUSTED_HOSTS
const cspReportOnly = process.env.CSP_REPORT_ONLY
const cspReportUri = process.env.CSP_REPORT_URI

const ipfsMode = process.env.IPFS_MODE
const walletconnectProjectId = process.env.WALLETCONNECT_PROJECT_ID

export default {
  basePath,
  // webpack5: true,
  experimental: {
    // Fixes a build error with importing Pure ESM modules, e.g. reef-knot
    // Some docs are here:
    // <https://github.com/vercel/next.js/pull/27069>
    // You can see how it is actually used in v12.3.4 here:
    // <https://github.com/vercel/next.js/blob/v12.3.4/packages/next/build/webpack-config.ts#L417>
    // Presumably, it is true by default in next v13 and won't be needed
    esmExternals: true,
  },
  compiler: {
    styledComponents: true,
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
        source: '/manifest.json',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Requested-With, content-type, Authorization',
          },
          {
            key: 'Content-Security-Policy',
            value:
              'frame-ancestors "self" https://app.safe.global https://app.safe.protofire.io;',
          },
        ],
      },
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
  serverRuntimeConfig: {
    basePath,
    rpcUrls_1,
    rpcUrls_17000,
    rpcUrls_560048,
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
