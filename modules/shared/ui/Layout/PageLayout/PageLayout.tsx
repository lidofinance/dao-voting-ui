import { Header } from '../Header'
import { Container } from '@lidofinance/lido-ui'

type Props = {
  children: React.ReactNode
}

export function PageLayout({ children }: Props) {
  return (
    <>
      <Container as="header" size="full">
        <Header />
      </Container>
      {children}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  )
}
