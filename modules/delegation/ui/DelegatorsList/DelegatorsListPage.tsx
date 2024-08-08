import { Fragment, useMemo } from 'react'
import { Identicon, Text, trimAddress } from '@lidofinance/lido-ui'
import { useDelegatorsPaginatedList } from 'modules/delegation/hooks/useDelegatorsPaginatedList'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { AddressBadgeWrap, DelegatorsListItem } from './DelegatorsListStyle'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'
import { useEnsNames } from 'modules/shared/hooks/useEnsNames'

type Props = {
  pageNumber: number
}

export function DelegatorsListPage({ pageNumber }: Props) {
  const { data, initialLoading } = useDelegatorsPaginatedList(pageNumber)
  const { data: governanceSymbol } = useGovernanceSymbol()

  const addresses = useMemo(() => data.map(item => item.address), [data])

  const { data: ensNameList } = useEnsNames(addresses)
  if (initialLoading) {
    return <PageLoader />
  }

  return (
    <Fragment key={pageNumber}>
      {data.map((delegator, i) => (
        <DelegatorsListItem key={delegator.address}>
          <AddressPop address={delegator.address}>
            <AddressBadgeWrap>
              <Identicon address={delegator.address} diameter={20} />
              <Text as="span" size="xxs">
                {(ensNameList && ensNameList[i]) ||
                  trimAddress(delegator.address, 4)}
              </Text>
            </AddressBadgeWrap>
          </AddressPop>
          <Text size="xs">
            {formatBalance(delegator.balance)} {governanceSymbol}
          </Text>
        </DelegatorsListItem>
      ))}
    </Fragment>
  )
}
