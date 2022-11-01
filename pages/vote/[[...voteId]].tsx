import { useRouter } from 'next/dist/client/router'

import { VoteForm } from 'modules/votes/ui/VoteForm'

export default function VotePage() {
  const router = useRouter()
  const { voteId: urlVoteId = [] } = router.query
  const [voteId] = urlVoteId as string[]

  return <VoteForm voteId={voteId} />
}

// #!if IPFS_MODE !== "true"
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
// #!endif
