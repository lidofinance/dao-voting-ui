import Image from 'next/image'
import { AvatarWrap } from './PublicDelegateListStyle'

import AvatarSvg from 'assets/avatar.com.svg.react'

type Props = {
  avatarSrc: string | null | undefined
}

export function PublicDelegateAvatar({ avatarSrc }: Props) {
  if (!avatarSrc) {
    return (
      <AvatarWrap>
        <AvatarSvg viewBox="0 0 52 52" />
      </AvatarWrap>
    )
  }

  return (
    <AvatarWrap>
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
