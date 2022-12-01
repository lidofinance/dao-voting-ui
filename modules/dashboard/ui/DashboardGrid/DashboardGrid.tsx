import range from 'lodash/range'

import { useState } from 'react'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { Container, Pagination } from '@lidofinance/lido-ui'
import { DashboardVote } from '../DashboardVote'
import { DashboardVoteSkeleton } from '../DashboardVoteSkeleton'
import { SkeletonBar } from 'modules/shared/ui/Skeletons/SkeletonBar'
import { GridWrap, PaginationWrap } from './DashboardGridStyle'

import { ContractVoting } from 'modules/blockChain/contracts'
import { getVoteStatus } from 'modules/votes/utils/getVoteStatus'

const PAGE_SIZE = 20

export function DashboardGrid() {
  const { chainId } = useWeb3()
  const [currentPage, setCurrentPage] = useState(0)
  const contractVoting = ContractVoting.useRpc()

  const infoSwr = useSWR(`dashboard-general-info-${chainId}`, async () => {
    const [votesTotalBn, voteTime, objectionPhaseTime] = await Promise.all([
      contractVoting.votesLength(),
      contractVoting.voteTime(),
      contractVoting.objectionPhaseTime(),
    ])

    return {
      voteTime: voteTime.toNumber(),
      votesTotal: votesTotalBn.toNumber(),
      objectionPhaseTime: objectionPhaseTime.toNumber(),
    }
  })

  const { voteTime, votesTotal, objectionPhaseTime } = infoSwr.data || {}

  const votesSwr = useSWR(
    votesTotal
      ? `dashboard-page-${currentPage}-of-${votesTotal}-${chainId}`
      : null,
    async () => {
      if (!votesTotal) return null

      const startId = votesTotal - 1 - currentPage * PAGE_SIZE
      const endId = Math.max(startId - PAGE_SIZE, 0)
      const ids = range(startId, endId, -1)

      const requests = ids.map(id =>
        (async () => {
          const [vote, canExecute] = await Promise.all([
            contractVoting.getVote(id),
            contractVoting.canExecute(id),
          ])
          return {
            id,
            vote,
            canExecute,
            status: getVoteStatus(vote, canExecute),
          }
        })(),
      )

      const votesList = await Promise.all(requests)

      return votesList
    },
  )
  const votesList = votesSwr.data

  const isLoading = infoSwr.initialLoading || votesSwr.initialLoading

  console.log(infoSwr.initialLoading)

  const paginationEl = (
    <PaginationWrap>
      {infoSwr.initialLoading ? (
        <SkeletonBar showOnBackground width={352} style={{ height: 32 }} />
      ) : (
        <Pagination
          pagesCount={Math.ceil((votesTotal || 1) / PAGE_SIZE)}
          activePage={currentPage + 1}
          onItemClick={(idx: number) => setCurrentPage(idx - 1)}
          siblingCount={1}
        />
      )}
    </PaginationWrap>
  )

  return (
    <Container as="main" size="full">
      {paginationEl}
      <GridWrap>
        {isLoading &&
          range(0, PAGE_SIZE).map(i => <DashboardVoteSkeleton key={i} />)}
        {votesList?.map(voteData => (
          <DashboardVote
            {...voteData}
            key={voteData.id}
            status={voteData.status!}
            voteTime={voteTime!}
            objectionPhaseTime={objectionPhaseTime!}
          />
        ))}
      </GridWrap>
      {paginationEl}
    </Container>
  )
}
