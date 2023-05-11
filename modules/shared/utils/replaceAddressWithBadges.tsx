import { AddressBadge } from 'modules/shared/ui/Common/AddressBadge'

import { replaceRegexWithJSX } from './replaceRegexWithJSX'
import { ADDRESS_REGEX } from 'modules/blockChain/utils/addressRegex'

export function replaceAddressWithBadges(text: string) {
  return replaceRegexWithJSX(text, ADDRESS_REGEX, address => (
    <AddressBadge address={address} />
  ))
}
