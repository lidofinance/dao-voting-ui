import range from 'lodash/range'
import Router from 'next/router'
import { useEffect } from 'react'
import { useSWR } from 'modules/network/hooks/useSwr'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { Box, Container, Pagination, Text } from '@lidofinance/lido-ui'
import { DashboardVote } from '../DashboardVote'
import { DashboardVoteSkeleton } from '../DashboardVoteSkeleton'
import { SkeletonBar } from 'modules/shared/ui/Skeletons/SkeletonBar'
import { GridWrap, PaginationWrap } from './DashboardGridStyle'
import { FetchErrorBanner } from 'modules/shared/ui/Common/FetchErrorBanner'
import { getVoteStatus } from 'modules/votes/utils/getVoteStatus'
import { getEventStartVote } from 'modules/votes/utils/getEventVoteStart'
import * as urls from 'modules/network/utils/urls'
import { getEventExecuteVote } from 'modules/votes/utils/getEventExecuteVote'
import { useContractHelpers } from 'modules/blockChain/hooks/useContractHelpers'
import { useProposals } from 'modules/dual-governance/hooks/useProposals'
import { ProposalsListItem } from '../DashboardDGProposal/DashboardDGProposal'

const PAGE_SIZE = 20

type Props = {
  currentPage: number
}

export function DashboardGrid({ currentPage }: Props) {
  const { chainId } = useWeb3()
  const { votingHelpers } = useContractHelpers()
  const voting = votingHelpers.useRpc()

  const { data: proposalsData } = useProposals()

  const handleChangePage = (nextPage: number) => {
    Router.push(urls.dashboardPage(nextPage))
  }
  const infoSwr = useSWR(
    `dashboard-general-info-${chainId}-${voting.address}`,
    async () => {
      const [votesTotalBn, voteTime, objectionPhaseTime] = await Promise.all([
        voting.votesLength(),
        voting.voteTime(),
        voting.objectionPhaseTime(),
      ])

      return {
        voteTime: voteTime.toNumber(),
        votesTotal: votesTotalBn.toNumber(),
        objectionPhaseTime: objectionPhaseTime.toNumber(),
      }
    },
  )

  const { voteTime, votesTotal, objectionPhaseTime } = infoSwr.data || {}

  const swrVotes = useSWR(
    votesTotal
      ? `dashboard-page-${currentPage}-${chainId}-${voting.address}`
      : null,
    async () => {
      if (!votesTotal) return null

      const startId = votesTotal - 1 - (currentPage - 1) * PAGE_SIZE
      const endId = Math.max(startId - PAGE_SIZE, 0)
      const ids = range(startId, endId, -1)

      const requests = ids.map(voteId => {
        const fetch = async () => {
          const [vote, canExecute] = await Promise.all([
            voting.getVote(voteId),
            voting.canExecute(voteId),
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

      const eventsPromises = votesList.map(async dataItem => {
        const snapshotBlock = dataItem.vote.snapshotBlock.toNumber()
        const eventStart = await getEventStartVote(
          voting,
          dataItem.voteId,
          snapshotBlock,
        )
        const eventExecute = await getEventExecuteVote(
          voting,
          dataItem.voteId,
          snapshotBlock,
        )

        return {
          ...dataItem,
          eventStart,
          executedAt: eventExecute?.executedAt,
        }
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
    voting.on('StartVote', handleNewVote)
    return () => {
      voting.off('StartVote', handleNewVote)
    }
  }, [voting, revalidateInfo, revalidateVotes, currentPage])

  if (isOutOfPageBoundy) {
    return null
  }

  if (swrVotes.error || infoSwr.error) {
    return (
      <Container as="main" size="tight">
        <FetchErrorBanner error={swrVotes.error || infoSwr.error} />
      </Container>
    )
  }

  return (
    <Container as="main" size="full">
      <Text>Dual Governance Proposals</Text>
      <br />
      <Box display="flex" overflowX="scroll">
        {proposalsData &&
          proposalsData.proposals.length > 0 &&
          proposalsData.proposals.map(proposal => (
            <ProposalsListItem
              key={Number(proposal.proposalId)}
              id={Number(proposal.proposalId)}
              description={proposal.DGEvent?.args.metadata || ''}
              proposalDetails={proposal.proposalDetails}
            />
          ))}
      </Box>
      <br />
      <Text>Aragon votes</Text>
      <br />
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
