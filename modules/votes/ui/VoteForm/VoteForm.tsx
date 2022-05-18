import { useMemo } from 'react'
import { useFormVoteInfo } from './useFormVoteInfo'
import { useFormVoteSubmit } from './useFormVoteSubmit'
import { useVotePassedCallback } from '../../hooks/useVotePassedCallback'

import { Container, Block } from '@lidofinance/lido-ui'
import { InputNumber } from 'modules/shared/ui/Controls/InputNumber'
import { Title } from 'modules/shared/ui/Common/Title'
import { Fieldset } from 'modules/shared/ui/Common/Fieldset'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { VoteDetails } from 'modules/votes/ui/VoteDetails'
import { TxRow } from 'modules/blockChain/ui/TxRow'
import { VoteFormActions } from '../VoteFormActions'
import { VoteFormMustConnect } from '../VoteFormMustConnect'
import { VoteFormVoterState } from '../VoteFormVoterState'

import { VoteStatus } from 'modules/votes/types'

type Props = {
  voteId?: string
  onChangeVoteId: React.ChangeEventHandler<HTMLInputElement>
}

export function VoteForm({ voteId, onChangeVoteId }: Props) {
  const {
    swrVote,
    swrCanVote,
    swrCanExecute,
    votePower,
    voteTime,
    isLoading,
    isWalletConnected,
    voterState,
    doRevalidate,
  } = useFormVoteInfo({ voteId })

  const { txVote, txEnact, handleVote, handleEnact, isSubmitting } =
    useFormVoteSubmit({
      voteId,
      onFinish: doRevalidate,
    })

  const isPassed = useVotePassedCallback({
    startDate: swrVote.data?.startDate.toNumber(),
    voteTime,
    onPass: doRevalidate,
  })

  const vote = swrVote.data
  const canExecute = swrCanExecute.data

  const status = useMemo(() => {
    if (!vote) return null
    if (vote.open && !vote.executed) return VoteStatus.Active
    if (!vote.open && vote.executed) return VoteStatus.Executed
    if (!vote.open && !vote.executed && canExecute) return VoteStatus.Pending
    if (!vote.open && !vote.executed && !canExecute) return VoteStatus.Rejected
  }, [vote, canExecute])

  const isEndedBeforeTime =
    status === VoteStatus.Rejected || status === VoteStatus.Executed
  const isEnded = Boolean(isPassed) || isEndedBeforeTime

  return (
    <Container as="main" size="tight">
      <Title
        title="DAO Voting"
        subtitle={voteId ? 'Do voting' : 'Enter voting id'}
      />
      <Block>
        <Fieldset>
          <InputNumber
            label="Vote #"
            name="voteId"
            error={swrVote.error ? 'Vote not found' : undefined}
            onChange={onChangeVoteId}
            defaultValue={voteId}
          />
        </Fieldset>

        {isLoading && <PageLoader />}

        {!isLoading && swrVote.data && (
          <>
            <VoteDetails
              vote={swrVote.data}
              status={status!}
              voteTime={voteTime!}
              isEnded={isEnded}
            />

            {!isWalletConnected && <VoteFormMustConnect />}

            {isWalletConnected && (
              <>
                <VoteFormVoterState
                  votePower={votePower!}
                  voterState={voterState!}
                  canVote={swrCanVote.data!}
                  isEnded={isEnded}
                />

                {swrCanVote.data && (
                  <>
                    <br />
                    <VoteFormActions
                      canExecute={Boolean(canExecute)}
                      isSubmitting={isSubmitting}
                      onVote={handleVote}
                      onEnact={handleEnact}
                    />
                  </>
                )}

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
          </>
        )}
      </Block>
    </Container>
  )
}
