import type { BigNumber } from 'ethers'

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
  const { data: govSymbol } = useGovernanceSymbol()

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
                  {trimAddress(event.voter, 4)}
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
              {/* {formatNumber(weiToNum(event.stake), 6)} {govSymbol} */}
            </ListRowCell>
          </ListRow>
        ))}
      </div>
    </Wrap>
  )
}
