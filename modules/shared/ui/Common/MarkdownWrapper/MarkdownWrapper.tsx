import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  replaceLinksInMD,
  replaceAddressAndCIDInMD,
  replaceImagesInMD,
} from 'modules/shared/utils/replaceCustomElementsInMD'

import { MarkdownWrap } from './MarkdownWrapperStyles'

type Props = React.ComponentProps<typeof ReactMarkdown>

export function MarkdownWrapper({ children: text, ...rest }: Props) {
  return (
    <MarkdownWrap>
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, {}]]}
        components={{
          a: replaceLinksInMD,
          img: replaceImagesInMD,
          code: replaceAddressAndCIDInMD,
        }}
        {...rest}
      >
        {text}
      </ReactMarkdown>
    </MarkdownWrap>
  )
}
