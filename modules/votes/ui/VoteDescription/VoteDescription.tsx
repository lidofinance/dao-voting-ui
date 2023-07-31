import removeMD from 'remove-markdown'
import { replaceJsxElements } from 'modules/shared/utils/replaceLinksWithComponents'
import { REGEX_LIDO_VOTE_CID } from 'modules/shared/utils/regexCID'

import { MarkdownWrapper } from 'modules/shared/ui/Common/MarkdownWrapper'
import { DescriptionText } from './VoteDescriptionStyle'

type Props = {
  metadata: string
  description?: string
  prettify?: boolean
}

export function VoteDescription({ metadata, description, prettify }: Props) {
  if (description && prettify) {
    return <MarkdownWrapper>{description}</MarkdownWrapper>
  }

  let text = description ? removeMD(description) : metadata

  const cid = metadata.match(REGEX_LIDO_VOTE_CID)?.[1]

  if (!description && cid) {
    const loadingInfo = `\nA detailed description will be uploaded to an IPFS soon. File hash:${cid} To read the description, please refresh the page in 15 minutes.`
    text = metadata.replace(REGEX_LIDO_VOTE_CID, '') + loadingInfo
  }

  return <DescriptionText>{replaceJsxElements(text)}</DescriptionText>
}
