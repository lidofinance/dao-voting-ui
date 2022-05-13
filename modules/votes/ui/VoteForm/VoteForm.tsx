import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useFormVoteInfo } from './useFormVoteInfo'
import { useFormVoteSubmit } from './useFormVoteSubmit'

import { Container, Block, Input, Text } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { Fieldset } from 'modules/shared/ui/Common/Fieldset'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { VoteDetails } from 'modules/votes/ui/VoteDetails'
import { TxRow } from 'modules/blockChain/ui/TxRow'
import { VoteFormActions } from '../VoteFormActions'
import { VoteFormMustConnect } from '../VoteFormMustConnect'

type Props = {
  voteId?: string
  onChangeVoteId: React.ChangeEventHandler<HTMLInputElement>
}

export function VoteForm({ voteId, onChangeVoteId }: Props) {
  const { isWalletConnected } = useWeb3()

  const { swrVote, swrCanVote, swrCanExecute } = useFormVoteInfo({ voteId })
  const { txVote, handleVote, isSubmitting } = useFormVoteSubmit({ voteId })

  const isLoading = swrVote.isValidating && swrCanExecute.isValidating

  const showActions =
    isWalletConnected && swrCanVote.data === true && !txVote.isSuccess

  const showCannotVote =
    isWalletConnected && swrCanVote.data === false && !txVote.isSuccess

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
              canExecute={Boolean(swrCanExecute.data)}
            />

            {!txVote.isEmpty && <TxRow label="Vote" tx={txVote} />}

            {!isWalletConnected && <VoteFormMustConnect />}

            {showActions && (
              <VoteFormActions
                isSubmitting={isSubmitting}
                onVote={handleVote}
              />
            )}

            {showCannotVote && (
              <Text size="xxs" color="secondary">
                You can not vote
              </Text>
            )}
          </>
        )}
      </Block>
    </Container>
  )
}
