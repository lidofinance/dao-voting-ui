import { Text, Tooltip } from '@lidofinance/lido-ui'
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
  const roundDown = (n: number): number => Math.floor(n * 10) / 10

  const nayInfo = showNumber
    ? `"No" — ${roundDown(nayNum)} (${nayPctOfTotalSupply}%)`
    : `"No" — ${nayPctOfTotalSupply}%`

  const yeaInfo = showNumber
    ? `"Yes" — ${roundDown(yeaNum)} (${yeaPctOfTotalSupply}%)`
    : `"Yes" — ${yeaPctOfTotalSupply}%`

  return (
    <>
      <VotesTitleWrap>
        <Text size="xxs">
          <Text as="span" size="xxs">
            <Tooltip title={<span>{nayNum}</span>} placement="top">
              <span>{nayInfo}</span>
            </Tooltip>
          </Text>
        </Text>
        <Text size="xxs" style={{ textAlign: 'right' }}>
          <Text as="span" size="xxs">
            <Tooltip title={<span>{yeaNum}</span>} placement="top">
              <span>{yeaInfo}</span>
            </Tooltip>
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
