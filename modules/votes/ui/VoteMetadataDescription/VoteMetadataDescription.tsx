import { DescriptionText } from './VoteMetadataDescriptionStyle'
import { replaceJsxElements } from 'modules/shared/utils/replaceLinksWithComponents'

type Props = {
  metadata: string
}

export function VoteMetadataDescription({ metadata }: Props) {
  return <DescriptionText>{replaceJsxElements(metadata)}</DescriptionText>
}
