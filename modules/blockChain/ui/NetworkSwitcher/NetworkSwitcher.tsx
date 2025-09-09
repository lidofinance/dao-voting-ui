import { useErrorMessage } from 'modules/blockChain/hooks/useErrorMessage'

import { Container } from '@lidofinance/lido-ui'
import { AttentionBanner } from 'modules/shared/ui/Common/AttentionBanner'

export function NetworkSwitcher() {
  const errorMessage = useErrorMessage()

  if (!errorMessage) {
    return null
  }

  return (
    <Container size="full">
      <AttentionBanner>{errorMessage}</AttentionBanner>
    </Container>
  )
}
