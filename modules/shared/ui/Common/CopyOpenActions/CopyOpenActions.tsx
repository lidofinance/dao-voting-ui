import { useEtherscanOpen } from '@lido-sdk/react'
import { useCopyToClipboard } from 'modules/shared/hooks/useCopyToClipboard'

import { ButtonIcon, Copy } from '@lidofinance/lido-ui'
import { Wrap } from './CopyOpenActionsStyle'
import { ButtonExternalView } from 'modules/shared/ui/Common/ButtonExternalView'

import type { EtherscanEntities } from '@lido-sdk/helpers'

type Props = {
  value: string | null | undefined
  entity: EtherscanEntities
}

export function CopyOpenActions({ value, entity }: Props) {
  const handleCopy = useCopyToClipboard(value ?? '')
  const handleEtherscan = useEtherscanOpen(value ?? '', entity)

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
