import range from 'lodash/range'
import Router from 'next/router'
import { useEffect } from 'react'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { Container, Pagination } from '@lidofinance/lido-ui'
import { DashboardVote } from '../DashboardVote'
import { DashboardVoteSkeleton } from '../DashboardVoteSkeleton'
import { SkeletonBar } from 'modules/shared/ui/Skeletons/SkeletonBar'
import { GridWrap, PaginationWrap } from './DashboardGridStyle'
import { ContractVoting } from 'modules/blockChain/contracts'
import { getVoteStatus } from 'modules/votes/utils/getVoteStatus'
import { getEventStartVote } from 'modules/votes/utils/getEventVoteStart'
import * as urls from 'modules/network/utils/urls'

const PAGE_SIZE = 20

type Props = {
  currentPage: number
}

export function DashboardGrid({ currentPage }: Props) {
  const { chainId } = useWeb3()
  const contractVoting = ContractVoting.useRpc()

  const handleChangePage = (nextPage: number) => {
    Router.push(urls.dashboardPage(nextPage))
  }

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

  const swrVotes = useSWR(
    votesTotal ? `dashboard-page-${currentPage}-${chainId}` : null,
    async () => {
      if (!votesTotal) return null

      const startId = votesTotal - 1 - (currentPage - 1) * PAGE_SIZE
      const endId = Math.max(startId - PAGE_SIZE, 0)
      const ids = range(startId, endId, -1)

      const requests = ids.map(voteId => {
        const fetch = async () => {
          const [vote, canExecute] = await Promise.all([
            contractVoting.getVote(voteId),
            contractVoting.canExecute(voteId),
          ])
          return {
            voteId,
            vote,
            canExecute,
            status: getVoteStatus(vote, canExecute),
          }
        }
        return fetch()
      })

      const votesList = await Promise.all(requests)

      const eventsPromises = votesList.map(dataItem => {
        const fetch = async () => {
          const eventStart = await getEventStartVote(
            contractVoting,
            dataItem.voteId,
            dataItem.vote.snapshotBlock.toNumber(),
          )
          return {
            ...dataItem,
            eventStart,
          }
        }
        return fetch()
      })

      const votesWithEvents = await Promise.all(eventsPromises)

      return votesWithEvents
    },
  )

  const revalidateInfo = infoSwr.mutate
  const revalidateVotes = swrVotes.mutate

  const isLoading = infoSwr.initialLoading || swrVotes.initialLoading
  const votesList = swrVotes.data
  const pagesCount = votesTotal ? Math.ceil(votesTotal / PAGE_SIZE) : 1

  const isOutOfPageBoundy =
    (!infoSwr.initialLoading && currentPage > pagesCount) || currentPage < 1

  useEffect(() => {
    if (isOutOfPageBoundy) {
      Router.replace(urls.dashboardIndex)
    }
  }, [isOutOfPageBoundy])

  useEffect(() => {
    const notNeedToRevalidate = currentPage !== 1
    if (notNeedToRevalidate) return
    const handleNewVote = async () => {
      await revalidateInfo()
      await revalidateVotes()
    }
    contractVoting.on('StartVote', handleNewVote)
    return () => {
      contractVoting.off('StartVote', handleNewVote)
    }
  }, [contractVoting, revalidateInfo, revalidateVotes, currentPage])

  if (isOutOfPageBoundy) {
    return null
  }

  return (
    <Container as="main" size="full">
      <GridWrap>
        {isLoading &&
          range(0, PAGE_SIZE).map(i => <DashboardVoteSkeleton key={i} />)}
        {votesList?.map(voteData => (
          <DashboardVote
            {...voteData}
            key={voteData.voteId}
            status={voteData.status!}
            voteTime={voteTime!}
            objectionPhaseTime={objectionPhaseTime!}
            onPass={revalidateVotes}
          />
        ))}
      </GridWrap>
      <PaginationWrap>
        {infoSwr.initialLoading ? (
          <SkeletonBar showOnBackground width={352} style={{ height: 32 }} />
        ) : (
          <Pagination
            pagesCount={pagesCount}
            activePage={currentPage}
            onItemClick={(idx: number) => handleChangePage(idx)}
            siblingCount={1}
          />
        )}
      </PaginationWrap>
    </Container>
  )
}
