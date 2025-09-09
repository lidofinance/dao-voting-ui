import { useCopyToClipboard } from 'modules/shared/hooks/useCopyToClipboard'
import { EtherscanEntity } from 'modules/blockChain/utils/etherscan'

import { ButtonIcon, Copy } from '@lidofinance/lido-ui'
import { Wrap } from './CopyOpenActionsStyle'
import { ButtonExternalView } from 'modules/shared/ui/Common/ButtonExternalView'
import { useEtherscanOpener } from 'modules/blockChain/hooks/useEtherscanOpener'

type Props = {
  value: string | null | undefined
  entity: EtherscanEntity
}

export function CopyOpenActions({ value, entity }: Props) {
  const handleCopy = useCopyToClipboard(value ?? '')
  const handleEtherscan = useEtherscanOpener(value ?? '', entity)

  const copyText =
    entity === 'address' ? 'address' : entity === 'tx' ? 'hash' : 'token'

  return (
    <Wrap>
      <ButtonIcon
        onClick={handleCopy}
        icon={<Copy />}
        size="xs"
        variant="ghost"
        children={`Copy ${copyText}`}
        data-testid="copyAddressBtn"
      />
      <ButtonExternalView
        onClick={handleEtherscan}
        children="View on Etherscan"
        variant="ghost"
        data-testid="etherscanBtn"
      />
    </Wrap>
  )
}
