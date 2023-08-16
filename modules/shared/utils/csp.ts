import { withSecureHeaders } from 'next-secure-headers'
import getConfig from 'next/config'
import { CustomAppProps } from './utilTypes'

const { serverRuntimeConfig } = getConfig()
const { cspTrustedHosts, cspReportOnly, cspReportUri } = serverRuntimeConfig

const trustedHosts = cspTrustedHosts
  ? cspTrustedHosts.split(',')
  : ['https://*.lido.fi']

const reportOnly = cspReportOnly === 'true'

export const contentSecurityPolicy = {
  directives: {
    styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
    fontSrc: ["'self'", 'https://fonts.gstatic.com', ...trustedHosts],
    imgSrc: [
      "'self'",
      'data:',
      'https://*.walletconnect.org',
      'https://*.walletconnect.com',
      ...trustedHosts,
    ],
    scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", ...trustedHosts],
    connectSrc: [
      "'self'",
      'wss://*.walletconnect.org',
      'https://*.walletconnect.org',
      'wss://*.walletconnect.com',
      'https://*.walletconnect.com',
      'https://api.thegraph.com',
      'https://*.infura.io',
      'https://*.alchemyapi.io',
      'https://*.alchemy.com',
      'https://*.etherscan.io/api',
      'https://*.ipfs.w3s.link',
      'https://cloudflare-ipfs.com/ipfs/',
      ...trustedHosts,
    ],
    prefetchSrc: ["'self'", ...trustedHosts],
    formAction: ["'self'", ...trustedHosts],
    frameAncestors: ['*'],
    manifestSrc: ["'self'", ...trustedHosts],
    mediaSrc: ["'self'", ...trustedHosts],
    childSrc: [
      "'self'",
      'https://*.walletconnect.org',
      'https://*.walletconnect.com',
      ...trustedHosts,
    ],
    objectSrc: ["'self'", ...trustedHosts],
    defaultSrc: ["'self'", ...trustedHosts],
    baseUri: ["'none'"],
    reportURI: cspReportUri,
  },
  reportOnly,
}

export const withCsp = (
  app: ({ envConfig, ...appProps }: CustomAppProps) => JSX.Element,
) =>
  withSecureHeaders({
    contentSecurityPolicy,
    frameGuard: false,
  })(app)
