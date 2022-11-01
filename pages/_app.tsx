import { memo, useMemo, useEffect } from 'react'
import Head from 'next/head'
import getConfig from 'next/config'
import NextApp, { AppProps, AppContext } from 'next/app'
import { useConfig } from 'modules/config/hooks/useConfig'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useErrorMessage } from 'modules/blockChain/hooks/useErrorMessage'
import { useSupportedChains, ProviderWeb3 } from '@lido-sdk/web3-react'

import { PageLayout } from 'modules/shared/ui/Layout/PageLayout'
import { GlobalStyle } from 'modules/globalStyles'
import {
  toast,
  ThemeProvider,
  themeDefault,
  ToastContainer,
  ToastError,
} from '@lidofinance/lido-ui'
import { ConfigProvider } from 'modules/config/providers/configProvider'
import { ModalProvider } from 'modules/modal/ModalProvider'
import { NetworkSwitcher } from 'modules/blockChain/ui/NetworkSwitcher'
import { VotePromptProvider } from 'modules/votes/providers/VotePrompt'

import { parseEnvConfig } from 'modules/config/utils/parseEnvConfig'
import { getAddressList } from 'modules/config/utils/getAddressList'
import { withCsp } from 'modules/shared/utils/csp'
import { CustomAppProps } from 'modules/shared/utils/utilTypes'

const basePath = getConfig().publicRuntimeConfig.basePath || ''

function AppRoot({ Component, pageProps }: AppProps) {
  const { chainId } = useWeb3()
  const { isUnsupported } = useSupportedChains()
  const error = useErrorMessage()

  useEffect(() => {
    if (!error || isUnsupported) return

    ToastError(error, {
      toastId: 'wallet-error',
      autoClose: false,
    })

    return () => toast.dismiss('wallet-error')
  }, [error, isUnsupported])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <title>Lido DAO Voting UI</title>

        <link rel="manifest" href={`${basePath}/manifest.json`} />
        <link
          rel="icon"
          type="image/svg+xml"
          href={`${basePath}/favicon-1080x1080.svg`}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${basePath}/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href={`${basePath}/favicon-192x192.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="180x180"
          href={`${basePath}/favicon-180x180.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${basePath}/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${basePath}/favicon-16x16.png`}
        />

        <meta name="currentChain" content={String(chainId)} />
        {getAddressList(chainId).map(({ contractName, address }) => (
          <meta key={contractName} name={contractName} content={address} />
        ))}
      </Head>
      <PageLayout>
        {!isUnsupported ? <Component {...pageProps} /> : <NetworkSwitcher />}
      </PageLayout>
      <ToastContainer />
    </>
  )
}

const AppRootMemo = memo(AppRoot)

function Web3ProviderWrap({ children }: { children: React.ReactNode }) {
  const { supportedChainIds, defaultChain, getRpcUrl } = useConfig()

  const backendRPC = useMemo(
    () =>
      supportedChainIds.reduce<Record<number, string>>(
        (res, curr) => ({ ...res, [curr]: getRpcUrl(curr) }),
        {},
      ),
    [supportedChainIds, getRpcUrl],
  )

  return (
    <ProviderWeb3
      defaultChainId={defaultChain}
      supportedChainIds={supportedChainIds}
      rpc={backendRPC}
      children={children}
    />
  )
}

function App({ envConfig, ...appProps }: CustomAppProps) {
  return (
    <ThemeProvider theme={themeDefault}>
      <GlobalStyle />
      <ConfigProvider envConfig={envConfig}>
        <Web3ProviderWrap>
          <VotePromptProvider>
            <ModalProvider>
              <AppRootMemo {...appProps} />
            </ModalProvider>
          </VotePromptProvider>
        </Web3ProviderWrap>
      </ConfigProvider>
    </ThemeProvider>
  )
}

export default process.env.NODE_ENV === 'development' ? App : withCsp(App)

App.getInitialProps = async (appContext: AppContext) => {
  const appProps = await NextApp.getInitialProps(appContext)
  const { publicRuntimeConfig } = getConfig()
  return {
    ...appProps,
    envConfig: parseEnvConfig(publicRuntimeConfig),
  }
}
