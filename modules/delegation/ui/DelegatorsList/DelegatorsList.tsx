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
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import {
  DELEGATORS_FETCH_TOTAL,
  DELEGATORS_PAGE_SIZE,
} from 'modules/delegation/constants'
import { InfoLabel } from 'modules/shared/ui/Common/InfoRow'
import { getEtherscanAddressLink } from '@lido-sdk/helpers'
import { AragonVoting } from 'modules/blockChain/contractAddresses'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'
import { useDelegators } from 'modules/delegation/hooks/useDelegators'
import { ExternalLink } from 'modules/shared/ui/Common/ExternalLink'
import { useGovernanceBalance } from 'modules/tokens/hooks/useGovernanceBalance'
import { DelegatorsListItem } from './DelegatorsListItem'

const DAO_OPS_FORUM_LINK =
  'https://research.lido.fi/new-message?groupname=DAO_Ops'

export function DelegatorsList() {
  const { isWalletConnected, chainId } = useWeb3()
  const [pageCount, setPageCount] = useState(1)
  const { data: governanceToken } = useGovernanceBalance()

  const { data, initialLoading } = useDelegators()

  const delegatorsToShow = useMemo(() => {
    if (!data.nonZeroDelegators.length) {
      return []
    }

    return data.nonZeroDelegators.slice(0, pageCount * DELEGATORS_PAGE_SIZE)
  }, [data.nonZeroDelegators, pageCount])

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

  const nonZeroDelegatorsCount = data.nonZeroDelegators.length

  if (nonZeroDelegatorsCount === 0) {
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
          {formatBalance(data.totalVotingPower)} {governanceToken?.symbol}
        </CounterBadge>
        <InfoLabel>
          from {nonZeroDelegatorsCount} address
          {nonZeroDelegatorsCount > 1 ? 'es' : ''} on-chain
        </InfoLabel>
      </TitleWrap>
      <DeelgatorsListStyled>
        {delegatorsToShow.map(delegator => (
          <DelegatorsListItem
            key={delegator.address}
            address={delegator.address}
            balance={delegator.balance}
            ensName={delegator.ensName}
            governanceSymbol={governanceToken?.symbol}
          />
        ))}
        {nonZeroDelegatorsCount > pageCount * DELEGATORS_PAGE_SIZE && (
          <ShowMoreButton onClick={() => setPageCount(count => count + 1)}>
            Show More
          </ShowMoreButton>
        )}
      </DeelgatorsListStyled>
      {data.notFetchedDelegatorsCount > 0 && (
        <Text size="xxs" color="secondary">
          This list displays addresses with a positive {governanceToken?.symbol}{' '}
          balance from the first {DELEGATORS_FETCH_TOTAL} delegators. You have{' '}
          {data.notFetchedDelegatorsCount} more delegator
          {data.notFetchedDelegatorsCount > 1 ? 's' : ''} who were not included
          in the list. To see all your delegators, use the{' '}
          <Link
            href={
              getEtherscanAddressLink(chainId, AragonVoting[chainId] ?? '') +
              '#readProxyContract'
            }
          >
            Voting contract
          </Link>
          . If needed, contact the{' '}
          <ExternalLink href={DAO_OPS_FORUM_LINK}>DAO Ops </ExternalLink> on the
          forum for assistance.
        </Text>
      )}
    </Wrap>
  )
}
