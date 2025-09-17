import { withSecureHeaders } from 'next-secure-headers'
import getConfig from 'next/config'
import { CustomAppProps } from './utilTypes'

const { serverRuntimeConfig } = getConfig()
const { cspTrustedHosts, cspReportOnly, cspReportUri } = serverRuntimeConfig

const trustedHosts = cspTrustedHosts ? cspTrustedHosts.split(',') : []

const reportOnly = cspReportOnly === 'true'

export const contentSecurityPolicy = {
  directives: {
    'default-src': ["'self'"],
    styleSrc: ["'self'", 'https://fonts.googleapis.com', "'unsafe-inline'"],
    fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com', ...trustedHosts],
    imgSrc: [
      "'self'",
      'data:',
      'https://*.walletconnect.org',
      'https://*.walletconnect.com',
    ],
    scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", ...trustedHosts],
    // Allow fetch connections to any secure host
    connectSrc: ["'self'", 'https:', 'wss:'],
    frameAncestors: ['*'],
    childSrc: [
      "'self'",
      'https://*.walletconnect.org',
      'https://*.walletconnect.com',
    ],
    baseUri: ["'none'"],
    workerSrc: ["'none'"],
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
    referrerPolicy: 'same-origin',
  })(app)
