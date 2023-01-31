const basePath = process.env.BASE_PATH || ''
const infuraApiKey = process.env.INFURA_API_KEY
const alchemyApiKey = process.env.ALCHEMY_API_KEY
const etherscanApiKey = process.env.ETHERSCAN_API_KEY

const defaultChain = process.env.DEFAULT_CHAIN
const supportedChains = process.env.SUPPORTED_CHAINS

const cspTrustedHosts = process.env.CSP_TRUSTED_HOSTS
const cspReportOnly = process.env.CSP_REPORT_ONLY
const cspReportUri = process.env.CSP_REPORT_URI

const settingsPrefillInfura = process.env.PUBLIC_UNSAFE_SETTINGS_PREFILL_INFURA
const settingsPrefillEtherscan =
  process.env.PUBLIC_UNSAFE_SETTINGS_PREFILL_ETHERSCAN

const ipfsMode = process.env.IPFS_MODE

module.exports = {
  basePath,
  webpack5: true,

  // Ipfs next.js configuration reference:
  // https://github.com/Velenir/nextjs-ipfs-example
  trailingSlash: true,
  assetPrefix: ipfsMode ? './' : undefined,

  // Ipfs version has hash-based routing
  // so we provide only index.html in ipfs version
  exportPathMap: ipfsMode ? () => ({ '/': { page: '/' } }) : undefined,

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
    infuraApiKey,
    alchemyApiKey,
    etherscanApiKey,
    cspTrustedHosts,
    cspReportOnly,
    cspReportUri,
  },
  publicRuntimeConfig: {
    defaultChain,
    supportedChains,
    ipfsMode,
    settingsPrefillInfura,
    settingsPrefillEtherscan,
  },
}
