import { debounce } from 'lodash'
import { useMemo } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useFormVoteInfo } from './useFormVoteInfo'
import { useFormVoteSubmit } from './useFormVoteSubmit'

import { Container, Block, Button, Input, Text } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { Fieldset } from 'modules/shared/ui/Common/Fieldset'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { VoteDetails } from 'modules/votes/ui/VoteDetails'
import { TxRow } from 'modules/blockChain/ui/TxRow'
import { Actions } from './VoteFormStyle'

import * as urls from 'modules/network/utils/urls'

type Props = {
  voteId?: string
}

export function VoteForm({ voteId }: Props) {
  const router = useRouter()

  const { swrVote, swrCanVote, swrCanExecute } = useFormVoteInfo({ voteId })
  const { txVote, handleVote, isSubmitting } = useFormVoteSubmit({ voteId })

  const handleChangeVoteId = useMemo(() => {
    return debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      router.replace(urls.vote(value), undefined, {
        scroll: false,
        shallow: true,
      })
    }, 500)
  }, [router])

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
            onChange={handleChangeVoteId}
            defaultValue={voteId}
          />
        </Fieldset>

        {swrVote.isValidating && <PageLoader />}

        {!swrVote.isValidating && !swrCanVote.isValidating && swrVote.data && (
          <>
            <VoteDetails vote={swrVote.data} />

            {!txVote.isEmpty && <TxRow label="Vote" tx={txVote} />}

            {swrCanVote.data === true && !txVote.isSuccess && (
              <Actions>
                <Button
                  children="Nay"
                  color="error"
                  loading={isSubmitting === 'nay'}
                  disabled={isSubmitting === 'yay'}
                  onClick={() => handleVote('nay')}
                />
                <Button
                  children="Yay"
                  loading={isSubmitting === 'yay'}
                  disabled={isSubmitting === 'nay'}
                  onClick={() => handleVote('yay')}
                />
              </Actions>
            )}

            {swrCanVote.data === false && !txVote.isSuccess && (
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
