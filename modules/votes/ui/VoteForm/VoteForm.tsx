import { useCallback, useMemo, Fragment } from 'react'
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
    startDate,
    votePower,
    voteTime,
    objectionPhaseTime,
    isLoading,
    isWalletConnected,
    voterState,
    doRevalidate,
  } = useFormVoteInfo({ voteId })

  const revalidateDelayed = useCallback(() => {
    setTimeout(() => doRevalidate(), 1000)
  }, [doRevalidate])

  const { txVote, txEnact, handleVote, handleEnact, isSubmitting } =
    useFormVoteSubmit({
      voteId,
      onFinish: revalidateDelayed,
    })

  const isPassed = useVotePassedCallback({
    startDate,
    voteTime,
    onPass: revalidateDelayed,
  })

  const isPassedMain = useVotePassedCallback({
    startDate,
    voteTime: voteTime && objectionPhaseTime && voteTime - objectionPhaseTime,
    onPass: revalidateDelayed,
  })

  const vote = swrVote.data
  const canExecute = swrCanExecute.data

  const status = useMemo(() => {
    if (!vote) return null

    const { open, executed, phase } = vote

    if (!open || isPassed) {
      if (executed) return VoteStatus.Executed
      if (canExecute) return VoteStatus.Pending
      return VoteStatus.Rejected
    }

    if (isPassedMain || (!executed && phase === 1)) {
      return VoteStatus.ActiveObjection
    }

    return VoteStatus.ActiveMain
  }, [vote, canExecute, isPassed, isPassedMain])

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

        {!isLoading && swrVote.data && status && (
          <Fragment key={voteId}>
            <VoteDetails
              vote={swrVote.data}
              status={status}
              voteTime={voteTime!}
              objectionPhaseTime={objectionPhaseTime!}
              isEnded={isEnded}
            />

            {!isWalletConnected && <VoteFormMustConnect />}

            {isWalletConnected && (
              <>
                <VoteFormVoterState
                  status={status}
                  votePower={votePower!}
                  voterState={voterState!}
                  canVote={swrCanVote.data!}
                  isEnded={isEnded}
                />

                {swrCanVote.data && (
                  <>
                    <br />
                    <VoteFormActions
                      status={status}
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
          </Fragment>
        )}
      </Block>
    </Container>
  )
}
