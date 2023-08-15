import removeMD from 'remove-markdown'
import { noop } from 'lodash'
import { InlineLoader } from '@lidofinance/lido-ui'
import { replaceJsxElements } from 'modules/shared/utils/replaceLinksWithComponents'
import { REGEX_LIDO_VOTE_CID } from 'modules/shared/utils/regexCID'

import { MarkdownWrapper } from 'modules/shared/ui/Common/MarkdownWrapper'
import { DescriptionText } from './VoteDescriptionStyle'
import { fetcherDescIPFS } from 'modules/network/utils/fetcherDescIPFS'
import { useSWR } from 'modules/network/hooks/useSwr'

type Props = {
  metadata: string
  allowMD?: boolean
}

const trimStart = (string = '') => `${string}`.replace(/^\s+/, '')

export function VoteDescription({ metadata, allowMD }: Props) {
  const cid = metadata.match(REGEX_LIDO_VOTE_CID)?.[1] || null

  const {
    data = '',
    error,
    initialLoading,
  } = useSWR(cid, fetcherDescIPFS, { onError: noop })

  if (!cid) {
    return <DescriptionText>{replaceJsxElements(metadata)}</DescriptionText>
  }

  if (initialLoading) {
    return <InlineLoader />
  }

  const trimmedData = trimStart(data)

  if (error || !trimmedData) {
    const text = metadata.replace(REGEX_LIDO_VOTE_CID, '')
    return (
      <DescriptionText>
        {replaceJsxElements(text)}
        {text.trim() ? `\n\n` : ''}
        {`A detailed description will be uploaded to an IPFS soon. File hash: `}
        <b>{cid}</b>
        {`. To read the description, please refresh the page in 15 minutes.`}
      </DescriptionText>
    )
  }

  if (trimmedData && allowMD) {
    return <MarkdownWrapper>{trimmedData}</MarkdownWrapper>
  }

  return (
    <DescriptionText>
      {replaceJsxElements(removeMD(trimmedData))}
    </DescriptionText>
  )
}
