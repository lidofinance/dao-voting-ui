import { Vote } from 'modules/votes/types'
import { weiToNum } from 'modules/blockChain/utils/parseWei'
import { formatFloatPct } from 'modules/shared/utils/formatFloatPct'
import { formatNumber } from 'modules/shared/utils/formatNumber'

type Args = {
  vote: Vote
  voteTime: number
}

export function getVoteDetailsFormatted({ vote, voteTime }: Args) {
  const totalSupply = weiToNum(vote.votingPower)
  const totalSupplyFormatted = formatNumber(totalSupply, 4)
  const nayNum = weiToNum(vote.nay)
  const yeaNum = weiToNum(vote.yea)
  const total = nayNum + yeaNum

  const nayPct = total > 0 ? formatFloatPct(nayNum / total) : 0
  const yeaPct = total > 0 ? formatFloatPct(yeaNum / total) : 0

  const nayPctOfTotalSupply = nayNum / totalSupply
  const yeaPctOfTotalSupply = yeaNum / totalSupply

  const nayPctOfTotalSupplyFormatted = totalSupply
    ? formatFloatPct(nayPctOfTotalSupply, { floor: true }).toFixed(2)
    : 0
  const yeaPctOfTotalSupplyFormatted = totalSupply
    ? formatFloatPct(yeaPctOfTotalSupply, { floor: true }).toFixed(2)
    : 0

  const startDate = vote.startDate.toNumber()
  const endDate = startDate + voteTime

  const neededToQuorum = weiToNum(vote.minAcceptQuorum) - yeaPctOfTotalSupply
  const neededToQuorumFormatted = formatFloatPct(neededToQuorum, {
    floor: true,
  }).toFixed(2)

  return {
    totalSupply,
    totalSupplyFormatted,
    nayNum,
    yeaNum,
    nayPct,
    yeaPct,
    nayPctOfTotalSupply,
    yeaPctOfTotalSupply,
    nayPctOfTotalSupplyFormatted,
    yeaPctOfTotalSupplyFormatted,
    neededToQuorum,
    neededToQuorumFormatted,
    startDate,
    endDate,
  }
}
