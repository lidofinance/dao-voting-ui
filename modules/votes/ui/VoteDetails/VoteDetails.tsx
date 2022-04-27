import { Text, DataTable, DataTableRow } from '@lidofinance/lido-ui'
import { FormattedDate } from 'modules/shared/ui/Utils/FormattedDate'
import {
  VotesTitleWrap,
  VotesBarWrap,
  VotesBarNay,
  VotesBarYea,
  ScriptBox,
} from './VoteDetailsStyle'

import { weiToNum, weiToStr } from 'modules/blockChain/utils/parseWei'
import type { Vote } from 'modules/votes/types'
import { useMemo, useState } from 'react'
import { useEVMScriptDecoder } from 'modules/votes/hooks/useEvmScriptDecoder'
import { useSWR } from 'modules/network/hooks/useSwr'

type Props = {
  vote: Vote
}

const DisplayTypes = ['Parsed', 'JSON', 'Raw'] as const
type DisplayType = typeof DisplayTypes[number]

export function VoteDetails({ vote }: Props) {
  const nayNum = weiToNum(vote.nay)
  const yeaNum = weiToNum(vote.yea)
  const total = nayNum + yeaNum
  const nayPct = total > 0 ? (nayNum / total) * 100 : 0
  const yeaPct = total > 0 ? (yeaNum / total) * 100 : 0

  const [currentDisplayType] = useState<DisplayType>(DisplayTypes[0])
  const decoder = useEVMScriptDecoder()

  const { data: decoded, initialLoading: isLoadingDecoded } = useSWR(
    ['swr:decode-script', vote.script],
    (_key, script) => {
      if (!script) return null
      return decoder.decodeEVMScript(script as string)
    },
  )

  const formattedScript = useMemo(() => {
    if (!vote.script || !decoded) return ''
    switch (currentDisplayType) {
      case 'Parsed':
        return decoded.calls
          .map(callInfo => {
            const { address, abi, decodedCallData } = callInfo

            let res = `Calls on address:\n${address}`

            res += '\n\nCode:\n'

            if (abi) {
              let inputsFormatted = abi.inputs
                ?.map(input => `\n\t${input.type} ${input.name}`)
                .join(',')
              if (inputsFormatted) inputsFormatted += '\n'

              res += `${abi.type} ${abi.name} (${inputsFormatted})`
            } else {
              res += '[abi not found]'
            }

            res += '\n\nCall data:\n'
            if (decodedCallData) {
              res += decodedCallData
                .map((data, i) => `[${i}] ${data}`)
                .join('\n')
            } else {
              res += '[call data not found]'
            }

            res += '\n'

            return res
          })
          .join('\n')

      case 'JSON':
        return JSON.stringify(decoded, null, 2)

      case 'Raw':
        return vote.script

      default:
        return ''
    }
  }, [decoded, vote.script, currentDisplayType])

  return (
    <>
      <DataTable>
        <DataTableRow title="Open status">
          {vote.open ? 'Open' : 'Not open'}
        </DataTableRow>

        <DataTableRow title="Execution status">
          {vote.executed ? 'Executed' : 'Not executed'}
        </DataTableRow>

        <DataTableRow title="Start date">
          <FormattedDate
            date={vote.startDate.toNumber()}
            format="MMM DD, YYYY / hh:mm a"
          />
        </DataTableRow>

        <DataTableRow title="Support required">
          {weiToStr(vote.supportRequired)}
        </DataTableRow>

        <DataTableRow title="Voting power">
          {weiToStr(vote.votingPower)}
        </DataTableRow>

        <DataTableRow title="Min accept quorum">
          {weiToStr(vote.minAcceptQuorum)}
        </DataTableRow>

        <DataTableRow title="Snapshot block">
          {vote.snapshotBlock.toString()}
        </DataTableRow>
      </DataTable>

      <VotesTitleWrap>
        <Text color="text" size="xxs">
          Nay: {nayNum}{' '}
          <Text as="span" color="secondary" size="xxs">
            ({nayPct.toFixed(2)}%)
          </Text>
        </Text>
        <Text color="text" size="xxs">
          Yay: {yeaNum}{' '}
          <Text as="span" color="secondary" size="xxs">
            ({yeaPct.toFixed(2)}%)
          </Text>
        </Text>
      </VotesTitleWrap>

      <VotesBarWrap>
        <VotesBarNay style={{ width: `${nayPct}%` }} />
        <VotesBarYea style={{ width: `${yeaPct}%` }} />
      </VotesBarWrap>

      <Text color="text" size="xxs">
        Script:
      </Text>

      <ScriptBox value={isLoadingDecoded ? vote.script : formattedScript} />
      <ScriptBox value={vote.script} />
    </>
  )
}
