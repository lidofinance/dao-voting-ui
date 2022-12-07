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

import { trimAddress } from '@lidofinance/lido-ui'
import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { formatNumber } from 'modules/shared/utils/formatNumber'
import type { CastVoteEventObject } from 'generated/VotingAbi'

type Props = {
  eventsVoted: CastVoteEventObject[]
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
              {formatNumber(weiToNum(event.stake), 6)} {govSymbol}
            </ListRowCell>
          </ListRow>
        ))}
      </div>
    </Wrap>
  )
}
