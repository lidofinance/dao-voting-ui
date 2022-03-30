import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useRouter } from 'next/dist/client/router'
import { VoteForm } from 'modules/votes/ui/VoteForm'

export default function VotePage() {
  const router = useRouter()
  const { isWalletConnected } = useWeb3()
  const { voteId: urlVoteId = [] } = router.query
  const [voteId] = urlVoteId as string[]
  if (!isWalletConnected) return null
  return <VoteForm voteId={voteId} />
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
