import { Container } from '@lidofinance/lido-ui'
import { CalldataDecoderForm } from 'modules/blockChain/ui/CalldataDecoderForm'

export default function CalldataDecoderPage() {
  return (
    <Container as="main" size="tight">
      <CalldataDecoderForm />
    </Container>
  )
}
