import { useFormVoteInfo } from './useFormVoteInfo'
import { useFormVoteSubmit } from './useFormVoteSubmit'

import { Container, Block, Input } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { Fieldset } from 'modules/shared/ui/Common/Fieldset'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { VoteDetails } from 'modules/votes/ui/VoteDetails'
import { TxRow } from 'modules/blockChain/ui/TxRow'
import { VoteFormActions } from '../VoteFormActions'
import { VoteFormMustConnect } from '../VoteFormMustConnect'
import { VoteFormVoterState } from '../VoteFormVoterState'

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
  } = useFormVoteInfo({ voteId })

  const { txVote, handleVote, isSubmitting } = useFormVoteSubmit({
    voteId,
    onFinish: () => 'Finish',
  })

  console.log('Balance at: ', votePower)
  console.log('Voter state: ', voterState)

  return (
    <Container as="main" size="tight">
      <Title
        title="DAO Voting"
        subtitle={voteId ? 'Do voting' : 'Enter voting id'}
      />
      <Block>
        <Fieldset>
          <Input
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
              voteTime={voteTime!}
              canExecute={Boolean(swrCanExecute.data)}
            />

            {!isWalletConnected && <VoteFormMustConnect />}

            {isWalletConnected && (
              <>
                <VoteFormVoterState
                  votePower={votePower!}
                  voterState={voterState!}
                  canVote={swrCanVote.data!}
                />

                {swrCanVote.data && (
                  <>
                    <br />
                    <VoteFormActions
                      isSubmitting={isSubmitting}
                      onVote={handleVote}
                    />
                  </>
                )}

                {!txVote.isEmpty && (
                  <>
                    <br />
                    <TxRow label="Vote transaction" tx={txVote} />
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
