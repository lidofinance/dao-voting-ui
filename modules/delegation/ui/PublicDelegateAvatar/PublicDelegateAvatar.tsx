import Image from 'next/image'
import { AvatarWrap } from './PublicDelegateAvatarStyle'

import AvatarSvg from 'assets/avatar.com.svg.react'

type Props = {
  avatarSrc: string | null | undefined
  size?: number
}

export function PublicDelegateAvatar({ avatarSrc, size }: Props) {
  if (!avatarSrc) {
    return (
      <AvatarWrap size={size}>
        <AvatarSvg viewBox="0 0 52 52" />
      </AvatarWrap>
    )
  }

  return (
    <AvatarWrap size={size}>
      <Image
        src={avatarSrc}
        alt=""
        layout="fill"
        loader={({ src }) => src}
        unoptimized
      />
    </AvatarWrap>
  )
}
