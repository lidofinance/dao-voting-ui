import { useCopyToClipboard } from 'modules/shared/hooks/useCopyToClipboard'
import {
  ETHERSCAN_ENTITIES,
  getEtherscanLink,
} from 'modules/blockChain/utils/getEtherscanLink'

import { ButtonIcon, Copy } from '@lidofinance/lido-ui'
import { Wrap } from './CopyOpenActionsStyle'
import { ButtonExternalView } from 'modules/shared/ui/Common/ButtonExternalView'
import { openWindow } from 'modules/shared/utils/openWindow'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

type Props = {
  value: string | null | undefined
  entity: ETHERSCAN_ENTITIES
}

export function CopyOpenActions({ value, entity }: Props) {
  const { chainId } = useWeb3()
  const handleCopy = useCopyToClipboard(value ?? '')

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
        onClick={() =>
          openWindow(getEtherscanLink(chainId, value ?? '', entity))
        }
        children="View on Etherscan"
        variant="ghost"
        data-testid="etherscanBtn"
      />
    </Wrap>
  )
}
