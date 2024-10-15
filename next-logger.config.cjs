// eslint-disable-next-line @typescript-eslint/no-var-requires
const pino = require('pino') // It's ok that pino is transit dependency, it's required by next-logger
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { satanizer, commonPatterns } = require('@lidofinance/satanizer')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const loadEnvConfig = require('@next/env').loadEnvConfig

// Must load env first
const projectDir = process.cwd()
loadEnvConfig(projectDir)

const patterns = [
  ...commonPatterns,
  process.env.INFURA_API_KEY,
  process.env.ALCHEMY_API_KEY,
  process.env.ETHERSCAN_API_KEY,
  process.env.WALLETCONNECT_PROJECT_ID,
  ...(process.env.EL_RPC_URLS_1 || 'NO_EL_RPC_URLS_1').split(','),
  ...(process.env.EL_RPC_URLS_17000 || 'NO_EL_RPC_URLS_17000').split(','),
]
const mask = satanizer(patterns)

const logger = defaultConfig =>
  pino({
    ...defaultConfig,
    formatters: {
      ...defaultConfig.formatters,
      level(label) {
        return { level: label }
      },
    },
    hooks: {
      logMethod(inputArgs, method) {
        return method.apply(this, mask(inputArgs))
      },
    },
  })

module.exports = {
  logger,
}
