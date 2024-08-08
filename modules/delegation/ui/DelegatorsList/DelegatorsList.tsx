import { Link, Text } from '@lidofinance/lido-ui'
import { useMemo, useState } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  DeelgatorsListStyled,
  ShowMoreButton,
  Wrap,
  CounterBadge,
  TitleWrap,
} from './DelegatorsListStyle'
import { DelegatorsListPage } from './DelegatorsListPage'
import { useDelegatorsInfo } from 'modules/delegation/hooks/useDelegatorsInfo'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import {
  DELEGATORS_FETCH_TOTAL,
  DELEGATORS_PAGE_SIZE,
} from 'modules/delegation/constants'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'
import { InfoLabel } from 'modules/shared/ui/Common/InfoRow'
import { getEtherscanAddressLink } from '@lido-sdk/helpers'
import { AragonVoting } from 'modules/blockChain/contractAddresses'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'

export function DelegatorsList() {
  const { isWalletConnected, chainId } = useWeb3()
  const [pageCount, setPageCount] = useState(1)
  const { data: governanceSymbol } = useGovernanceSymbol()

  const { data, initialLoading } = useDelegatorsInfo()

  const pages = useMemo(() => {
    const result = []
    for (let i = 0; i < pageCount; i++) {
      result.push(<DelegatorsListPage pageNumber={i} key={i} />)
    }
    return result
  }, [pageCount])

  if (!isWalletConnected) {
    return (
      <Wrap $empty={true}>
        <Text size="sm" color="secondary">
          Connect wallet to see your delegators
        </Text>
      </Wrap>
    )
  }

  if (initialLoading) {
    return <PageLoader />
  }

  if (data.wealthyCount === 0) {
    return (
      <Wrap $empty={true}>
        <Text size="sm" color="secondary">
          No delegated voting power
        </Text>
      </Wrap>
    )
  }

  return (
    <Wrap>
      <TitleWrap>
        <InfoLabel>Delegated</InfoLabel>
        <CounterBadge>
          {formatBalance(data.fetchedValue || 0)} {governanceSymbol}
        </CounterBadge>
        <InfoLabel>
          from {data.wealthyCount} address
          {data.wealthyCount > 1 ? 'es' : ''} on-chain
        </InfoLabel>
      </TitleWrap>
      <DeelgatorsListStyled>
        {pages}
        {data.wealthyCount > pageCount * DELEGATORS_PAGE_SIZE && (
          <ShowMoreButton onClick={() => setPageCount(count => count + 1)}>
            Show More
          </ShowMoreButton>
        )}
      </DeelgatorsListStyled>
      {data.totalCount > data.fetchedCount && (
        <Text size="xs" color="secondary">
          Voting power display is limited to {DELEGATORS_FETCH_TOTAL}{' '}
          delegators. To see all your delegators, use the{' '}
          <Link
            href={getEtherscanAddressLink(chainId, AragonVoting[chainId] ?? '')}
          >
            Voting contract
          </Link>
          . If needed, contact the{' '}
          <Link href="https://research.lido.fi/new-message?groupname=DAO_Ops">
            DAO Ops{' '}
          </Link>{' '}
          on the forum for assistance.
        </Text>
      )}
    </Wrap>
  )
}
