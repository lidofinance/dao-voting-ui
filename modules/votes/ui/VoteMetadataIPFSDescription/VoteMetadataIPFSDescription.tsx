import { DescriptionText } from './VoteMetadataIPFSDescriptionStyle'
import { replaceJsxElements } from 'modules/shared/utils/replaceLinksWithComponents'
import { useSWR } from 'modules/network/hooks/useSwr'
import { fetcherIPFS } from 'modules/network/utils/fetcherIPFS'
import { InlineLoader } from '@lidofinance/lido-ui'

type Props = {
  cid: string
}

export function VoteMetadataIPFSDescription({ cid }: Props) {
  const { data = '', error, initialLoading } = useSWR(cid, fetcherIPFS)
  if (initialLoading) {
    return <InlineLoader />
  }
  if (error) {
    return (
      <DescriptionText>
        ⚠️ Failed to load vote content, please try again later.
      </DescriptionText>
    )
  }
  return <DescriptionText>{replaceJsxElements(data)}</DescriptionText>
}
