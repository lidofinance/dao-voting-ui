import Link from 'next/link'
import { useMemo, Fragment } from 'react'
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
import { ErrorMessage } from './VoteFormStyle'

import { VoteStatus } from 'modules/votes/types'
import { isVoteEnactable } from 'modules/votes/utils/isVoteEnactable'
import * as urls from 'modules/network/utils/urls'

type Props = {
  voteId?: string
  onChangeVoteId: React.ChangeEventHandler<HTMLInputElement>
}

export function VoteForm({ voteId, onChangeVoteId }: Props) {
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
  } = useFormVoteInfo({ voteId })

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

  const { open, executed, phase } = vote || {}

  const status = useMemo(() => {
    if (!vote) return null

    if (!open) {
      if (executed) return VoteStatus.Executed
      if (canExecute && !isVoteEnactable(vote)) return VoteStatus.Passed
      if (canExecute && isVoteEnactable(vote)) return VoteStatus.Pending
      return VoteStatus.Rejected
    }

    if (!executed && phase === 1) {
      return VoteStatus.ActiveObjection
    }

    return VoteStatus.ActiveMain
  }, [vote, open, executed, phase, canExecute])

  const isEnded =
    status === VoteStatus.Rejected || status === VoteStatus.Executed
  const canEnact = Boolean(canExecute) && status === VoteStatus.Pending

  const isNotFound = swrVote.error?.reason === 'VOTING_NO_VOTE'

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
            error={isNotFound ? 'Vote not found' : undefined}
            onChange={onChangeVoteId}
            defaultValue={voteId}
          />
        </Fieldset>

        {isLoading && <PageLoader />}

        {!isLoading && swrVote.error && !isNotFound && (
          <ErrorMessage>
            <p>There is a problem with rpc node currently in use.</p>
            <p>
              You can set your own url on{' '}
              <Link href={urls.settings}>settings</Link> page.
            </p>
          </ErrorMessage>
        )}

        {!isLoading && vote && status && (
          <Fragment key={voteId}>
            <VoteDetails
              vote={vote}
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
                  canVote={canVote}
                  canEnact={canEnact}
                  isEnded={isEnded}
                />

                <br />
                <VoteFormActions
                  status={status}
                  canVote={canVote}
                  canEnact={canEnact}
                  isSubmitting={isSubmitting}
                  onVote={handleVote}
                  onEnact={handleEnact}
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
          </Fragment>
        )}
      </Block>
    </Container>
  )
}
