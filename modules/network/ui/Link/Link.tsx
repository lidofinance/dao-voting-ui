import { useCallback } from 'react'
import { usePrefixedPush } from 'modules/network/hooks/usePrefixedHistory'

import LinkNext from 'next/link'

import { IPFS_MODE } from 'modules/config'

type Props = {
  href: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  children?: React.ReactNode
}

function LinkIpfs({ onClick, ...props }: Props) {
  const push = usePrefixedPush()
  const { href } = props

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    e => {
      e.preventDefault()
      push(href)
      onClick?.(e)
    },
    [onClick, push, href],
  )

  return <a {...props} onClick={handleClick} />
}

export const Link = IPFS_MODE ? LinkIpfs : LinkNext
