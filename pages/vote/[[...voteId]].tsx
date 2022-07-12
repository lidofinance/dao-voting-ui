import { debounce } from 'lodash'
import { useMemo } from 'react'
import { useRouter } from 'next/dist/client/router'

import { VoteForm } from 'modules/votes/ui/VoteForm'

import * as urls from 'modules/network/utils/urls'

export default function VotePage() {
  const router = useRouter()
  const { voteId: urlVoteId = [] } = router.query
  const [voteId] = urlVoteId as string[]

  const handleChangeVoteId = useMemo(() => {
    return debounce((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      router.replace(urls.vote(value), undefined, {
        scroll: false,
        shallow: true,
      })
    }, 500)
  }, [router])

  return <VoteForm voteId={voteId} onChangeVoteId={handleChangeVoteId} />
}

// #!if IPFS_MODE !== "true"
// eslint-disable-next-line @typescript-eslint/require-await
export const getServerSideProps = async () => {
  return {
    props: {},
  }
}
// #!endif
