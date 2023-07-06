import { Link } from '@lidofinance/lido-ui'
import { AddressBadge } from '../ui/Common/AddressBadge'

import { REGEX_ETH_ADDRESS } from 'modules/shared/utils/regexEthAddress'
import { REGEX_URL } from 'modules/shared/utils/regexURL'

import { replaceRegexWithJSX } from './replaceRegexWithJSX'

export const replaceJsxElements = (text: string) => {
  return replaceRegexWithJSX(text, [
    {
      regex: REGEX_URL,
      replace: link => <Link href={link}>{link}</Link>,
    },
    {
      regex: REGEX_ETH_ADDRESS,
      replace: address => <AddressBadge address={address} />,
    },
  ])
}
