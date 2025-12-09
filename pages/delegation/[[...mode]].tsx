import { FC } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Container } from '@lidofinance/lido-ui'
import {
  DelegationTabs,
  DelegationTabsLayoutProps,
} from 'modules/delegation/ui/DelegationTabs'

const DelegationPage: FC<DelegationTabsLayoutProps> = ({ mode }) => {
  return (
    <Container as="main" size="full">
      <Head>
        <title>Delegation | Lido DAO Voting UI</title>
      </Head>
      <DelegationTabs mode={mode} />
    </Container>
  )
}

export default DelegationPage

type DelegationModePageParams = {
  mode: string[] | undefined
}

// we need [[...]] pattern for /, /customize and /delegators
export const getServerSideProps: GetServerSideProps<
  DelegationTabsLayoutProps,
  DelegationModePageParams
  // eslint-disable-next-line @typescript-eslint/require-await
> = async ({ params }) => {
  const mode = params?.mode
  if (!mode) return { props: { mode: 'delegation' } }
  if (mode.length > 1) return { notFound: true }
  if (mode[0] === 'delegators') return { props: { mode: 'delegators' } }
  if (mode[0] === 'customize') return { props: { mode: 'customize' } }
  return { notFound: true }
}
