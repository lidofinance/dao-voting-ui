import { useFormVoteInfo } from './useFormVoteInfo'
import { useFormVoteSubmit } from './useFormVoteSubmit'
import { useVotePassedCallback } from '../../hooks/useVotePassedCallback'
import { useVotePrompt } from 'modules/votes/providers/VotePrompt'

import { Card } from 'modules/shared/ui/Common/Card'
import { Container, Text } from '@lidofinance/lido-ui'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { VoteDetails } from 'modules/votes/ui/VoteDetails'
import { TxRow } from 'modules/blockChain/ui/TxRow'
import { VoteFormActions } from '../VoteFormActions'
import { VoteFormMustConnect } from '../VoteFormMustConnect'
import { VoteFormVoterState } from '../VoteFormVoterState'
import { VoteVotersList } from '../VoteVotersList'
import { Desc, ClearButton } from './VoteFormStyle'
import { FetchErrorBanner } from 'modules/shared/ui/Common/FetchErrorBanner'

import { VoteStatus } from 'modules/votes/types'

type Props = {
  voteId?: string
}

export function VoteForm({ voteId }: Props) {
  const {
    swrVote,
    vote,
    startDate,
    voteTime,
    votePower,
    canVote,
    canExecute,
    objectionPhaseTime,
    isLoading,
    isWalletConnected,
    voterState,
    doRevalidate,
    eventStart,
    eventsVoted,
    eventExecuteVote,
    status,
  } = useFormVoteInfo({ voteId })
  const { clearVoteId } = useVotePrompt()

  const { txVote, txEnact, handleVote, handleEnact, isSubmitting } =
    useFormVoteSubmit({
      voteId,
      onFinish: doRevalidate,
    })

  useVotePassedCallback({
    startDate,
    voteTime,
    onPass: doRevalidate,
  })

  useVotePassedCallback({
    startDate,
    voteTime: voteTime && objectionPhaseTime && voteTime - objectionPhaseTime,
    onPass: doRevalidate,
  })

  const isEnded =
    status === VoteStatus.Rejected || status === VoteStatus.Executed
  const canEnact = Boolean(canExecute) && status === VoteStatus.Pending

  const isEmpty = !voteId
  const isNotFound = swrVote.error?.reason === 'VOTING_NO_VOTE'
  const isFound = !isEmpty && !isNotFound && !isLoading && vote && status

  return (
    <Container as="main" size="tight" key={voteId}>
      {isEmpty && (
        <Desc>
          <Text as="p" size="sm" weight={700}>
            Enter DAO vote # in the search input above
          </Text>
          <Text as="p" size="xs" weight={400} color="secondary">
            The DAO vote you are looking for will be displayed here
          </Text>
        </Desc>
      )}

      {isLoading && <PageLoader />}

      {isNotFound && (
        <Desc>
          <p>
            <Text as="span" size="sm" weight={700} color="secondary">
              No result found:{' '}
            </Text>
            <Text as="span" size="sm" weight={700}>
              {voteId}
            </Text>
          </p>
          <Text as="p" size="xs" weight={400} color="secondary">
            Sorry, we weren&apos;t able to find any votes for your search. Try
            another search.
          </Text>
          <br />
          <ClearButton onClick={clearVoteId}>Clear search</ClearButton>
        </Desc>
      )}

      {!isLoading && swrVote.error && !isNotFound && (
        <FetchErrorBanner error={swrVote.error} />
      )}

      {isFound && (
        <Card>
          <VoteDetails
            vote={vote}
            voteId={voteId}
            status={status}
            voteTime={voteTime!}
            objectionPhaseTime={objectionPhaseTime!}
            isEnded={isEnded}
            creator={eventStart?.creator}
            metadata={eventStart?.metadata}
            executedTxHash={eventExecuteVote?.event.transactionHash}
          />

          {!isWalletConnected && <VoteFormMustConnect />}

          {isWalletConnected && (
            <>
              <VoteFormActions
                status={status}
                canVote={canVote}
                canEnact={canEnact}
                voterState={voterState!}
                isSubmitting={isSubmitting}
                onVote={handleVote}
                onEnact={handleEnact}
              />

              <VoteFormVoterState
                status={status}
                votePower={votePower!}
                voterState={voterState!}
                canVote={canVote}
                canEnact={canEnact}
                snapshotBlock={vote.snapshotBlock.toNumber()}
                startDate={startDate!}
                isEnded={isEnded}
              />

              {!txVote.isEmpty && (
                <>
                  <br />
                  <TxRow label="Vote transaction" tx={txVote} />
                </>
              )}

              {!txEnact.isEmpty && (
                <>
                  <br />
                  <TxRow label="Vote enact" tx={txEnact} />
                </>
              )}
            </>
          )}

          {eventsVoted && eventsVoted.length > 0 && (
            <VoteVotersList eventsVoted={eventsVoted} />
          )}
        </Card>
      )}
    </Container>
  )
}
