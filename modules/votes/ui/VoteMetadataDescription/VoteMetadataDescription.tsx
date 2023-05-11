import { replaceAddressWithBadges } from 'modules/shared/utils/replaceAddressWithBadges'
import { DescriptionText } from './VoteMetadataDescriptionStyle'

type Props = {
  metadata: string
}

export function VoteMetadataDescription({ metadata }: Props) {
  return <DescriptionText>{replaceAddressWithBadges(metadata)}</DescriptionText>
}
