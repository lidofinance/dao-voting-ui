import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  prepareMDForReplace,
  replaceLinksInMD,
  replaceAddressAndCIDInMD,
  replaceImagesInMD,
} from 'modules/shared/utils/replaceCustomElementsInMD'

import { MarkdownWrap } from './MarkdownWrapperStyles'

type Props = React.ComponentProps<typeof ReactMarkdown>

export function MarkdownWrapper({ children: text, ...rest }: Props) {
  const markdown = prepareMDForReplace(text)
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
        {markdown}
      </ReactMarkdown>
    </MarkdownWrap>
  )
}
