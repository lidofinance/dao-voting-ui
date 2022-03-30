import { debounce, noop } from 'lodash'
import { useCallback, useMemo, useState } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useTransactionSender } from 'modules/blockChain/hooks/useTransactionSender'

import { Container, Block, Button, Input, Text } from '@lidofinance/lido-ui'
import { Title } from 'modules/shared/ui/Common/Title'
import { Fieldset } from 'modules/shared/ui/Common/Fieldset'
import { ContractVoting } from 'modules/blockChain/contracts'
import { PageLoader } from 'modules/shared/ui/Common/PageLoader'
import { VoteDetails } from 'modules/votes/ui/VoteDetails'
import { TxRow } from 'modules/blockChain/ui/TxRow'
import { Actions } from './VoteFormStyle'

import * as urls from 'modules/network/utils/urls'
// import { estimateGasFallback } from 'modules/shared/utils/estimateGasFallback'

type VoteMode = 'yay' | 'nay'

type Props = {
  voteId?: string
}

export function VoteForm({ voteId }: Props) {
  const { walletAddress } = useWeb3()
  const router = useRouter()
  const [submitting, setSubmitting] = useState<false | VoteMode>(false)

  const contractVoting = ContractVoting.useWeb3()

  const swrVote = ContractVoting.useSwrWeb3(
    Boolean(voteId) && 'getVote',
    [voteId!],
    {
      onError: noop,
    },
  )

  const swrCanVote = ContractVoting.useSwrWeb3(
    Boolean(voteId) && 'canVote',
    [voteId!, walletAddress!],
    {
      onError: noop,
    },
  )

  const handleChangeVoteId = useMemo(() => {
    return debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      router.replace(urls.vote(value), undefined, {
        scroll: false,
        shallow: true,
      })
    }, 500)
  }, [router])

  const populateVote = useCallback(
    async (args: { voteId: string; mode: VoteMode }) => {
      const tx = await contractVoting.populateTransaction.vote(
        args.voteId,
        args.mode === 'yay',
        false,
        {
          gasLimit: 650000,
        },
      )
      return tx
    },
    [contractVoting],
  )
  const txVote = useTransactionSender(populateVote)

  const handleVote = useCallback(
    async (mode: VoteMode) => {
      if (!voteId) return

      try {
        setSubmitting(mode)
        //
        //       Gas amount can not be estimating for unknown reason
        // TODO: Figure out why
        //
        // const gasLimit = await estimateGasFallback(
        //   contractVoting.estimateGas.vote(voteId, mode === 'yay', false),
        // )
        //
        await txVote.send({ voteId, mode })
      } catch (err) {
        console.error(err)
      }

      setSubmitting(false)
    },
    [voteId, txVote],
  )

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
                  loading={submitting === 'nay'}
                  disabled={submitting === 'yay'}
                  onClick={() => handleVote('nay')}
                />
                <Button
                  children="Yay"
                  loading={submitting === 'yay'}
                  disabled={submitting === 'nay'}
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
