import { Text } from '@lidofinance/lido-ui'
import {
  VotesBarNay,
  VotesBarWrap,
  VotesBarYea,
  VotesTitleWrap,
} from './VoteYesNoBarStyle'

type Props = {
  yeaPct: number
  nayPct: number
  yeaNum: number
  nayNum: number
  yeaPctOfTotalSupply: React.ReactNode
  nayPctOfTotalSupply: React.ReactNode
  showOnForeground?: boolean
  showNumber?: boolean
}

export function VoteYesNoBar({
  yeaPct,
  nayPct,
  yeaNum,
  nayNum,
  yeaPctOfTotalSupply,
  nayPctOfTotalSupply,
  showOnForeground,
  showNumber,
}: Props) {
  const nayInfo = showNumber
    ? `"No" — ${nayNum} (${nayPctOfTotalSupply}%)`
    : `"No" — ${nayPctOfTotalSupply}%`

  const yeaInfo = showNumber
    ? `"Yes" — ${yeaNum} (${yeaPctOfTotalSupply}%)`
    : `"Yes" — ${yeaPctOfTotalSupply}%`

  return (
    <>
      <VotesTitleWrap>
        <Text size="xxs">
          <Text as="span" size="xxs">
            {nayInfo}
          </Text>
        </Text>
        <Text size="xxs" style={{ textAlign: 'right' }}>
          <Text as="span" size="xxs">
            {yeaInfo}
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
