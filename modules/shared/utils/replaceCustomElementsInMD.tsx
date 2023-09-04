import React from 'react'
import type { Components } from 'react-markdown'

import { ExternalLink } from '../ui/Common/ExternalLink'
import { AddressBadge } from '../ui/Common/AddressBadge'

import { REGEX_ETH_ADDRESS_ONLY } from 'modules/shared/utils/regexEthAddress'
import { REGEX_CID_CUTER, REGEX_CID_ONLY } from 'modules/shared/utils/regexCID'
import { REGEX_URL_ONLY } from 'modules/shared/utils/regexURL'
import { getIpfsUrl } from 'modules/config/network'

type CodeType = Components['code']
export const replaceAddressAndCIDInMD: CodeType = ({
  inline,
  children,
  ...props
}) => {
  const value = Array.isArray(children) ? `${children[0]}` : `${children}`

  if (inline && value.match(REGEX_CID_ONLY)) {
    return (
      <ExternalLink href={getIpfsUrl(value)}>
        {value.replace(REGEX_CID_CUTER, '$1..$2')}
      </ExternalLink>
    )
  }

  if (inline && value.match(REGEX_ETH_ADDRESS_ONLY)) {
    return <AddressBadge address={value} />
  }

  return <code {...props}>{children}</code>
}
type LinkType = Components['a']

export const replaceLinksInMD: LinkType = ({ children, href }) => {
  if (href?.match(REGEX_URL_ONLY)) {
    return <ExternalLink href={href}>{children}</ExternalLink>
  }
  // not supporting internal links
  return (
    <span>
      {children}
      {href ? ` (${href})` : ''}
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
  if (src?.match(REGEX_URL_ONLY)) {
    return (
      <ExternalLink href={src} {...props}>
        {title || alt || 'view'} image
      </ExternalLink>
    )
  }
  // not supporting internal links
  return (
    <span>
      {title || alt || children}
      {src ? ` (${src})` : ''}
    </span>
  )
}
