import { Container } from '@lidofinance/lido-ui'
import { AttentionBanner } from 'modules/shared/ui/Common/AttentionBanner'

export function TestModeBanner() {
  return (
    <Container size="full">
      <AttentionBanner>
        The app is currently running in Test Mode
      </AttentionBanner>
    </Container>
  )
}
