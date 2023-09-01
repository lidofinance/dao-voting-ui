import * as ethers from 'ethers'
import { CHAINS } from '@lido-sdk/constants'
import { ContractVoting } from 'modules/blockChain/contracts'
import {
  fetchForkTransactionsList,
  requestNetworkFork,
  requestSimulationShare,
} from './tenderlyFetchers'
import { estimateGasFallback } from 'modules/shared/utils/estimateGasFallback'
import { Vote } from 'modules/votes/types'

const TREASURY_ADDRESS: Partial<Record<CHAINS, string>> = {
  [CHAINS.Mainnet]: '0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c',
  [CHAINS.Goerli]: '0x4333218072D5d7008546737786663c38B4D561A4',
} as const

export const getForkSimulationUrl = (id: string) =>
  `https://dashboard.tenderly.co/shared/fork/simulation/${id}`

export const createNetworkFork = async (args: { chainId: CHAINS }) => {
  const fork = await requestNetworkFork(args)
  const { id: forkId } = fork.simulation_fork
  const rpcUrl = `https://rpc.tenderly.co/fork/${forkId}`
  const forkProvider = new ethers.providers.JsonRpcProvider(rpcUrl)
  return {
    forkId,
    forkProvider,
  }
}

export const sumulateVoteEnactmentOnFork = async ({
  chainId,
  voteId,
  vote,
  voteTime,
  objectionPhaseTime,
}: {
  chainId: CHAINS
  voteId: string
  vote: Vote
  voteTime: number
  objectionPhaseTime: number
}) => {
  const { forkId, forkProvider } = await createNetworkFork({ chainId })

  const treasuryAddress = TREASURY_ADDRESS[chainId]!
  const treasurySigner = forkProvider.getSigner(treasuryAddress)
  const forkedVotingContract = ContractVoting.connect({
    chainId,
    library: treasurySigner,
  })

  const { timestamp } = await forkProvider.getBlock('latest')
  const startDate = vote.startDate.toNumber()
  const objectionEndDate = startDate + (voteTime - objectionPhaseTime)
  const endDate = startDate + voteTime

  if (timestamp < objectionEndDate) {
    const gasLimit = await estimateGasFallback(
      forkedVotingContract.estimateGas.vote(voteId, true, false),
      2000000,
    )

    const voteTx = await forkedVotingContract.populateTransaction.vote(
      voteId,
      true,
      false,
      {
        gasLimit,
      },
    )

    await treasurySigner.sendTransaction({
      ...voteTx,
      from: treasuryAddress,
    })
  }

  if (timestamp < endDate) {
    await forkProvider.send('evm_increaseTime', [
      ethers.utils.hexValue(endDate - timestamp),
    ])
    await forkProvider.send('evm_increaseBlocks', [ethers.utils.hexValue(1)])
  }

  const gasLimit = await estimateGasFallback(
    forkedVotingContract.estimateGas.executeVote(voteId),
    2000000,
  )

  const tx = await forkedVotingContract.executeVote(voteId, { gasLimit })

  const { fork_transactions } = await fetchForkTransactionsList(forkId)

  const { id: txTenderlyId } = fork_transactions.find(
    forkTx => forkTx.hash === tx.hash,
  )!

  await requestSimulationShare(forkId, txTenderlyId)

  return txTenderlyId
}
