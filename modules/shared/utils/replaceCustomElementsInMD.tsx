import React from 'react'
import type { Components } from 'react-markdown'

import { ExternalLink } from '../ui/Common/ExternalLink'
import { AddressBadge } from '../ui/Common/AddressBadge'

import {
  REGEX_ETH_ADDRESS,
  REGEX_ETH_ADDRESS_IN_MD,
} from 'modules/shared/utils/regexEthAddress'
import { REGEX_CID, REGEX_CID_IN_MD } from 'modules/shared/utils/regexCID'
import { REGEX_URL } from 'modules/shared/utils/regexURL'
import { getUrlFromCID } from 'modules/shared/utils/getUrlFromCID'

/**
 * Make special elements as inline code to find them during transformation to JSX
 * @param text - Markdown string
 */
export const prepareMDForReplace = (text: string) => {
  return text
    .replace(REGEX_ETH_ADDRESS_IN_MD, '$1')
    .replace(REGEX_ETH_ADDRESS, '`$1`')
    .replace(REGEX_CID_IN_MD, '$1')
    .replace(REGEX_CID, '`$1`')
}

const isMainMatch = (regexp: RegExp, string: string) =>
  string.match(regexp)?.[0] === string

type CodeType = Components['code']
export const replaceAddressAndCIDInMD: CodeType = ({
  inline,
  children,
  ...props
}) => {
  const value = Array.isArray(children) ? `${children[0]}` : `${children}`
  const isCID = isMainMatch(REGEX_CID, value)
  const isAddress = isMainMatch(REGEX_ETH_ADDRESS, value)

  if (inline && isCID) {
    return <ExternalLink href={getUrlFromCID(value)}>{value}</ExternalLink>
  }

  if (inline && isAddress) {
    return <AddressBadge address={value} />
  }

  return <code {...props}>{children}</code>
}
type LinkType = Components['a']

export const replaceLinksInMD: LinkType = ({ children, href, ...props }) => {
  if (href && href.match(REGEX_URL)?.[0]) {
    return <ExternalLink {...props}>{children}</ExternalLink>
  }
  // not supporting internal links
  return (
    <span {...props}>
      <>
        {children}
        {href && `(${href})`}
      </>
    </span>
  )
}

type ImgType = Components['img']

export const replaceImagesInMD: ImgType = ({
  children,
  title,
  alt,
  src,
  ...props
}) => {
  console.log(props, children)
  if (src && src.match(REGEX_URL)?.[0]) {
    return (
      <ExternalLink href={src} {...props}>
        {title || alt || 'view'} image
      </ExternalLink>
    )
  }
  return <div>{children}</div>
}
