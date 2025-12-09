import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Container } from '@lidofinance/lido-ui'
import {
  DelegationTabs,
  DelegationTabsLayoutProps,
} from 'modules/delegation/ui/DelegationTabs'

type DelegationMode = 'delegators' | 'customize'

export default function DelegationPage({ mode }: { mode: DelegationMode }) {
  return (
    <Container as="main" size="full">
      <Head>
        <title>Delegation | Lido DAO Voting UI</title>
      </Head>
      <DelegationTabs mode={mode} />
    </Container>
  )
}

type DelegationModePageParams = {
  mode: ['delegators'] | ['customize'] | undefined
}
export const getServerSideProps: GetServerSideProps<
  DelegationTabsLayoutProps,
  DelegationModePageParams
  // eslint-disable-next-line @typescript-eslint/require-await
> = async props => {
  const mode = props.params?.mode
  if (!mode) return { props: { mode: 'delegation' } }

  return { props: { mode: mode[0] }, revalidate: 60 }
}
