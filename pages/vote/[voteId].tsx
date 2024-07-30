import { useRouter } from 'next/dist/client/router'
import { VoteForm } from 'modules/votes/ui/VoteForm'
import { VoteFormActionsProvider } from 'modules/votes/providers/VoteFormActions/VoteFormActionsContext'
import { ModalProvider } from 'modules/modal/ModalProvider'

export default function VotePage() {
  const router = useRouter()
  const { voteId } = router.query
  if (!voteId || typeof voteId !== 'string') {
    router.replace('/')
    return null
  }
  return (
    <VoteFormActionsProvider>
      <ModalProvider>
        <VoteForm voteId={voteId} />
      </ModalProvider>
    </VoteFormActionsProvider>
  )
}

// #!if IPFS_MODE !== "true"
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
// #!endif
