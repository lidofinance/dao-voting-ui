import { useCallback, useMemo, useState } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useSWR } from 'modules/network/hooks/useSwr'

import { ButtonIcon, ToastError } from '@lidofinance/lido-ui'
import { TenderlyIcon } from './VoteSimulationStyle'

import {
  getForkSimulationUrl,
  simulateVoteEnactmentOnFork,
} from './tenderlyUtils'
import { fetchForkTransactionsList, fetchForksList } from './tenderlyFetchers'
import { getErrorMessage } from 'modules/shared/utils/getErrorMessage'
import { openWindow } from 'modules/shared/utils/openWindow'
import type { Vote } from 'modules/votes/types'
import type { PopulatedTransaction } from 'ethers'

type Props = {
  voteId: string
  vote: Vote
  voteTime?: number
  objectionPhaseTime?: number
  populateEnact: () => Promise<PopulatedTransaction>
}

export const VoteSimulation = ({
  voteId,
  vote,
  voteTime,
  objectionPhaseTime,
  populateEnact,
}: Props) => {
  const { chainId } = useWeb3()
  const [simulationIdState, setSimulationId] = useState<string | undefined>(
    undefined,
  )
  const [isPendingSimulation, setPendingSimulation] = useState(false)

  const { data: enactTxPopulated, initialLoading: isLoadingTx } = useSWR(
    ['populated-enact-tx', voteId],
    populateEnact,
  )

  const { data: simulationsList, initialLoading: isLoadingList } = useSWR(
    'tenderly-simulations-list',
    async () => {
      const { simulation_forks: forks } = await fetchForksList()
      const transactionsRaw = await Promise.all(
        forks.map(fork => fetchForkTransactionsList(fork.id)),
      )
      const transactions = transactionsRaw.reduce(
        (prev, curr) => [...prev, ...curr.fork_transactions],
        [],
      )
      return transactions
    },
  )

  const simulationPreexisted = useMemo(() => {
    if (!simulationsList || !enactTxPopulated) return null
    return simulationsList.find(
      s =>
        s.status === true &&
        s.to.toLowerCase() === enactTxPopulated.to?.toLowerCase() &&
        s.input === enactTxPopulated.data,
    )
  }, [simulationsList, enactTxPopulated])

  const isLoading = isLoadingList || isLoadingTx || isPendingSimulation
  const simulationId = simulationPreexisted?.id ?? simulationIdState

  const runSimulation = useCallback(async () => {
    if (!enactTxPopulated || !voteTime || !objectionPhaseTime) return
    setPendingSimulation(true)
    try {
      const id = await simulateVoteEnactmentOnFork({
        chainId,
        voteId,
        vote,
        voteTime,
        objectionPhaseTime,
        // TODO: add forkedVotingContract
        forkedVotingContract: null as any,
      })
      setSimulationId(id)
      return id
    } catch (error) {
      console.error(error)
      ToastError(getErrorMessage(error), {})
    } finally {
      setPendingSimulation(false)
    }
  }, [chainId, enactTxPopulated, vote, voteId, voteTime, objectionPhaseTime])

  const handleClick = useCallback(async () => {
    if (isLoading || !enactTxPopulated) return
    let id = simulationId
    if (!id) {
      id = await runSimulation()
    }
    if (id) openWindow(getForkSimulationUrl(id))
  }, [isLoading, enactTxPopulated, simulationId, runSimulation])

  return (
    <ButtonIcon
      icon={<TenderlyIcon />}
      color="secondary"
      variant="translucent"
      fullwidth
      loading={isLoading}
      onClick={handleClick}
    >
      {simulationId ? 'Show' : 'Run'} Tenderly enactment simulation
    </ButtonIcon>
  )
}
