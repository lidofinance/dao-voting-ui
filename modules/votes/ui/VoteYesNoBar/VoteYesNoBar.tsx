import { Text, Tooltip } from '@lidofinance/lido-ui'
import {
  VotesBarNay,
  VotesBarWrap,
  VotesBarYea,
  VotesTitleWrap,
} from './VoteYesNoBarStyle'

const vpFormatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 0,
})

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
    ? `"No" — ${vpFormatter.format(nayNum)} (${nayPctOfTotalSupply}%)`
    : `"No" — ${nayPctOfTotalSupply}%`

  const yeaInfo = showNumber
    ? `"Yes" — ${vpFormatter.format(yeaNum)} (${yeaPctOfTotalSupply}%)`
    : `"Yes" — ${yeaPctOfTotalSupply}%`

  return (
    <>
      <VotesTitleWrap>
        <Text size="xxs">
          <Text data-testid="votesNo" as="span" size="xxs">
            <Tooltip title={<span>{nayNum}</span>} placement="top">
              <span>{nayInfo}</span>
            </Tooltip>
          </Text>
        </Text>
        <Text size="xxs" style={{ textAlign: 'right' }}>
          <Text as="span" size="xxs" data-testid="votesYes">
            <Tooltip title={<span>{yeaNum}</span>} placement="top">
              <span>{yeaInfo}</span>
            </Tooltip>
          </Text>
        </Text>
      </VotesTitleWrap>

      <VotesBarWrap
        data-testid="votesYesNoBar"
        showOnForeground={showOnForeground}
      >
        <VotesBarNay style={{ width: `${nayPct}%` }} />
        <VotesBarYea style={{ width: `${yeaPct}%` }} />
      </VotesBarWrap>
    </>
  )
}
