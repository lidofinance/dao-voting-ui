import { useErrorMessage } from 'modules/blockChain/hooks/useErrorMessage'

import { Container } from '@lidofinance/lido-ui'
import { Wrap } from './NetworkSwitcherStyle'
import DangerIconSVG from 'assets/danger.com.svg.react'

export function NetworkSwitcher() {
  const errorMessage = useErrorMessage()

  return (
    <Container size="full">
      <Wrap>
        <DangerIconSVG />
        <span>{errorMessage}</span>
      </Wrap>
    </Container>
  )
}
