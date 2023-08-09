import { ExternalLink } from '../ui/Common/ExternalLink'
import { AddressBadge } from '../ui/Common/AddressBadge'

import { REGEX_ETH_ADDRESS } from 'modules/shared/utils/regexEthAddress'
import { REGEX_URL } from 'modules/shared/utils/regexURL'
import { REGEX_CID, REGEX_CID_CUTER } from 'modules/shared/utils/regexCID'
import { getUrlFromCID } from 'modules/shared/utils/getUrlFromCID'

import { replaceRegexWithJSX } from './replaceRegexWithJSX'

export const replaceJsxElements = (text: string) => {
  return replaceRegexWithJSX(text, [
    {
      regex: REGEX_URL,
      replace: link => <ExternalLink href={link}>{link}</ExternalLink>,
    },
    {
      regex: REGEX_ETH_ADDRESS,
      replace: address => <AddressBadge address={address} />,
    },
    {
      regex: REGEX_CID,
      replace: cid => (
        <ExternalLink href={getUrlFromCID(cid)}>
          {cid.replace(REGEX_CID_CUTER, '$1..$2')}
        </ExternalLink>
      ),
    },
  ])
}
