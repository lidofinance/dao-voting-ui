import { useConfig } from 'modules/config/hooks/useConfig'

import { Text } from 'modules/shared/ui/Common/Text'
import { Container } from '@lidofinance/lido-ui'
import { Wrap } from './NetworkSwitcherStyle'
import DangerIconSVG from 'assets/danger.com.svg.react'

import { getChainName } from 'modules/blockChain/chains'

export function NetworkSwitcher() {
  const { supportedChainIds } = useConfig()
  const networksList = supportedChainIds.map(chainId => getChainName(chainId))

  return (
    <Container size="full">
      <Wrap>
        <DangerIconSVG />
        <Text size={12} weight={500}>
          Unsupported chain. You will not be able to make a vote. Please switch
          to {networksList.join(', ')} in your wallet.
        </Text>
      </Wrap>
    </Container>
  )
}
