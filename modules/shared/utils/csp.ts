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
    imgSrc: ["'self'", 'data:', 'https://*.walletconnect.org', ...trustedHosts],
    scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", ...trustedHosts],
    connectSrc: [
      "'self'",
      'wss://*.walletconnect.org',
      'https://*.walletconnect.org',
      'https://api.thegraph.com',
      'https://*.infura.io',
      'https://*.alchemyapi.io',
      'https://*.etherscan.io/api',
      ...trustedHosts,
    ],
    prefetchSrc: ["'self'", ...trustedHosts],
    formAction: ["'self'", ...trustedHosts],
    frameAncestors: ['*'],
    manifestSrc: ["'self'", ...trustedHosts],
    mediaSrc: ["'self'", ...trustedHosts],
    childSrc: ["'self'", ...trustedHosts],
    objectSrc: ["'self'", ...trustedHosts],
    defaultSrc: ["'self'", ...trustedHosts],
    baseUri: ["'none'"],
    reportURI: cspReportUri || undefined,
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
