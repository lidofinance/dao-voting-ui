import { FC } from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
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
  mode: ['delegators'] | undefined
}

export const getStaticPaths: GetStaticPaths<DelegationModePageParams> = () => {
  return {
    paths: [
      { params: { mode: undefined } },
      { params: { mode: ['delegators'] } },
    ],
    fallback: false, // return 404 on non match
  }
}

// we need [[...]] pattern for / and /unwrap
export const getStaticProps: GetStaticProps<
  DelegationTabsLayoutProps,
  DelegationModePageParams
> = ({ params }) => {
  const mode = params?.mode
  if (!mode) return { props: { mode: 'delegation' }, revalidate: 60 }

  return { props: { mode: 'delegators' }, revalidate: 60 }
}
