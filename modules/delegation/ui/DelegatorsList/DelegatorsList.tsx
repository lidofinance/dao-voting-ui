import { Text } from '@lidofinance/lido-ui'
import { useMemo, useState } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import {
  DeelgatorsListStyled,
  ShowMoreButton,
  Wrap,
} from './DelegatorsListStyle'
import { DelegatorsListPage } from './DelegatorsListPage'
import { useDelegatorsInfo } from 'modules/delegation/hooks/useDelegatorsInfo'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { DELEGATORS_PAGE_SIZE } from 'modules/delegation/constants'

export function DelegatorsList() {
  const { isWalletConnected } = useWeb3()
  const [pageCount, setPageCount] = useState(1)

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

  if (initialLoading || typeof data?.delegatorsCount !== 'number') {
    return <PageLoader />
  }

  if (data.delegatorsCount === 0) {
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
      <Text size="sm" color="secondary">
        Delegated from {data.delegatorsCount} voter
        {data.delegatorsCount > 1 ? 's' : ''} on-chain
      </Text>
      <DeelgatorsListStyled>
        {pages}
        {data.delegatorsCount > DELEGATORS_PAGE_SIZE && (
          <ShowMoreButton onClick={() => setPageCount(count => count + 1)}>
            Show More
          </ShowMoreButton>
        )}
      </DeelgatorsListStyled>
    </Wrap>
  )
}
