import type { BigNumber } from 'ethers'

import { useMemo } from 'react'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'

import { InfoRowFull } from 'modules/shared/ui/Common/InfoRow'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'
import {
  Wrap,
  ListRow,
  ListRowCell,
  AddressWrap,
  Identicon,
} from './VoteVotersListStyle'
import { Tooltip, trimAddress } from '@lidofinance/lido-ui'

import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { formatNumber } from 'modules/shared/utils/formatNumber'
import type { CastVoteEventObject } from 'generated/VotingAbi'

type Props = {
  eventsVoted: CastVoteEventObject[]
}

const formatter = Intl.NumberFormat('en', {
  notation: 'compact',
  maximumSignificantDigits: 3,
})
const formatAmount = (amount: BigNumber) => {
  return formatter.format(weiToNum(amount))
}

export function VoteVotersList({ eventsVoted }: Props) {
  const { library } = useWeb3()
  const { data: govSymbol } = useGovernanceSymbol()
  const addresses = useMemo(() => eventsVoted.map(e => e.voter), [eventsVoted])

  const { data: ensNames } = useSWR(addresses, async () => {
    const res = await Promise.all(
      eventsVoted.map(e => library.lookupAddress(e.voter)),
    )
    return res
  })

  return (
    <Wrap>
      <InfoRowFull title="Voted" />
      <div>
        {eventsVoted.map((event, i) => (
          <ListRow key={`${event.voter}-${i}}`}>
            <ListRowCell>
              <AddressPop address={event.voter}>
                <AddressWrap>
                  <Identicon address={event.voter} diameter={20} />
                  {(ensNames && ensNames[i]) || trimAddress(event.voter, 4)}
                </AddressWrap>
              </AddressPop>
            </ListRowCell>
            <ListRowCell>{event.supports ? 'Yes' : 'No'}</ListRowCell>
            <ListRowCell>
              <Tooltip
                placement="top"
                title={formatNumber(weiToNum(event.stake), 6)}
              >
                <div>
                  {formatAmount(event.stake)} {govSymbol}
                </div>
              </Tooltip>
            </ListRowCell>
          </ListRow>
        ))}
      </div>
    </Wrap>
  )
}
