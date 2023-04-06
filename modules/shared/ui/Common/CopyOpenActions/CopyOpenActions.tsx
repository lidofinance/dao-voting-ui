import { useCallback } from 'react'
import { getEtherscanLink, openWindow } from '@lido-sdk/helpers'
import type { EtherscanEntities } from '@lido-sdk/helpers'
import { useCopyToClipboard } from 'modules/shared/hooks/useCopyToClipboard'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

import { ButtonIcon, Copy } from '@lidofinance/lido-ui'
import { Wrap } from './CopyOpenActionsStyle'
import { ButtonExternalView } from 'modules/shared/ui/Common/ButtonExternalView'

type Props = {
  value: string | null | undefined
  entity: EtherscanEntities
}

export function CopyOpenActions({ value, entity }: Props) {
  const { chainId } = useWeb3()
  const handleCopy = useCopyToClipboard(value ?? '')

  const handleEtherscan = useCallback(() => {
    const link = getEtherscanLink(chainId, value ?? '', entity)
    openWindow(link)
  }, [chainId, entity, value])

  const copyText =
    entity === 'address' ? 'address' : entity === 'tx' ? 'hash' : 'token'

  return (
    <Wrap>
      <ButtonIcon
        onClick={handleCopy}
        icon={<Copy />}
        size="xs"
        variant="translucent"
        children={`Copy ${copyText}`}
      />
      <ButtonExternalView
        onClick={handleEtherscan}
        children="View on Etherscan"
      />
    </Wrap>
  )
}
