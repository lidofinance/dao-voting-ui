import { useFormVoteInfo } from './useFormVoteInfo'
import { useFormVoteSubmit } from './useFormVoteSubmit'
import { useVotePassedCallback } from '../../hooks/useVotePassedCallback'
import { useVotePrompt } from 'modules/votes/providers/VotePrompt'

import { Card } from 'modules/shared/ui/Common/Card'
import { Container, Text } from '@lidofinance/lido-ui'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { VoteDetails } from 'modules/votes/ui/VoteDetails'
import { VoteFormActions } from '../VoteFormActions'
import { VoteFormMustConnect } from '../VoteFormMustConnect'
import { Desc, ClearButton } from './VoteFormStyle'
import { FetchErrorBanner } from 'modules/shared/ui/Common/FetchErrorBanner'
import { VoteInfoDelegated } from 'modules/votes/ui/VoteInfoDelegated'
import { VotePowerInfo } from '../VotePowerInfo'

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
    votePowerWei,
    canExecute,
    objectionPhaseTime,
    isLoading,
    isWalletConnected,
    walletAddress,
    voterState,
    doRevalidate,
    eventStart,
    eventsVoted,
    eventExecuteVote,
    eventsDelegatesVoted,
    status,
    votePhase,
  } = useFormVoteInfo({ voteId })
  const { clearVoteId } = useVotePrompt()

  const { handleEnact, isSubmitting } = useFormVoteSubmit({
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
  const canEnact = Boolean(canExecute)

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
            metadata={eventStart?.metadata}
            eventsVoted={eventsVoted}
            eventsDelegatesVoted={eventsDelegatesVoted}
            executedTxHash={eventExecuteVote?.event.transactionHash}
            votePhase={votePhase}
          />

          {!isWalletConnected && <VoteFormMustConnect />}

          {isWalletConnected && (
            <>
              <VoteInfoDelegated
                eventsVoted={eventsVoted}
                eventsDelegatesVoted={eventsDelegatesVoted}
                walletAddress={walletAddress}
              />
              <VotePowerInfo ownVotePower={votePowerWei} />
              <VoteFormActions
                canEnact={canEnact}
                voterState={voterState!}
                isSubmitting={isSubmitting}
                onEnact={handleEnact}
                votePhase={votePhase}
                votePowerWei={votePowerWei}
                voteId={voteId}
              />
            </>
          )}
        </Card>
      )}
    </Container>
  )
}
