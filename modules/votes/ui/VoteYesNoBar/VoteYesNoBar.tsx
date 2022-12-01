import { Text } from '@lidofinance/lido-ui'
import {
  VotesBarNay,
  VotesBarWrap,
  VotesBarYea,
  VotesTitleWrap,
} from './VoteYesNoBarStyle'

type Props = {
  yeaPct: React.ReactNode
  nayPct: React.ReactNode
  yeaPctOfTotalSupply: React.ReactNode
  nayPctOfTotalSupply: React.ReactNode
  showOnForeground?: boolean
}

export function VoteYesNoBar({
  yeaPct,
  nayPct,
  yeaPctOfTotalSupply,
  nayPctOfTotalSupply,
  showOnForeground,
}: Props) {
  return (
    <>
      <VotesTitleWrap>
        <Text size="xxs">
          <Text as="span" color="secondary" size="xxs">
            No —{' '}
          </Text>
          <Text as="span" size="xxs">
            {nayPctOfTotalSupply}%
          </Text>
        </Text>
        <Text size="xxs" style={{ textAlign: 'right' }}>
          <Text as="span" color="secondary" size="xxs">
            Yes —{' '}
          </Text>
          <Text as="span" size="xxs">
            {yeaPctOfTotalSupply}%
          </Text>
        </Text>
      </VotesTitleWrap>

      <VotesBarWrap showOnForeground={showOnForeground}>
        <VotesBarNay style={{ width: `${nayPct}%` }} />
        <VotesBarYea style={{ width: `${yeaPct}%` }} />
      </VotesBarWrap>
    </>
  )
}
