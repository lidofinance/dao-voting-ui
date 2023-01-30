import { useCallback, useMemo } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useDisconnect, useConnectorInfo } from '@reef-knot/web3-react'
import { useGovernanceBalance } from 'modules/tokens/hooks/useGovernanceBalance'
import { useGovernanceSymbol } from 'modules/tokens/hooks/useGovernanceSymbol'
import { useConfig } from 'modules/config/hooks/useConfig'

import { Text } from 'modules/shared/ui/Common/Text'
import { CopyOpenActions } from 'modules/shared/ui/Common/CopyOpenActions'
import { Modal, ModalProps, Identicon, trimAddress } from '@lidofinance/lido-ui'
import {
  Content,
  Connected,
  Connector,
  Disconnect,
  Row,
  Address,
} from './WalletModalStyle'

import { formatToken } from 'modules/tokens/utils/formatToken'

function WalletModalContent() {
  const { walletAddress } = useWeb3()
  const trimmedAddress = useMemo(
    () => trimAddress(walletAddress ?? '', 6),
    [walletAddress],
  )
  const governanceBalance = useGovernanceBalance()
  const { data: governanceSymbol } = useGovernanceSymbol()

  return (
    <>
      <Row>
        <Text
          size={12}
          weight={500}
          children={`${governanceSymbol} Balance:`}
        />
        <Text size={12} weight={500}>
          &nbsp;
          {governanceBalance.initialLoading || !governanceBalance.data
            ? 'Loading...'
            : formatToken(governanceBalance.data, governanceSymbol || '')}
        </Text>
      </Row>

      <Row>
        <Identicon address={walletAddress ?? ''} />
        <Address>{trimmedAddress}</Address>
      </Row>

      <Row>
        <CopyOpenActions value={walletAddress} entity="address" />
      </Row>
    </>
  )
}

export function WalletModal(props: ModalProps) {
  const { onClose } = props
  const { providerName } = useConnectorInfo()
  const { disconnect } = useDisconnect()
  const { chainId } = useWeb3()
  const { supportedChainIds } = useConfig()
  const isChainSupported = useMemo(
    () => supportedChainIds.includes(chainId),
    [chainId, supportedChainIds],
  )

  const handleDisconnect = useCallback(() => {
    disconnect?.()
    onClose?.()
  }, [disconnect, onClose])

  return (
    <Modal title="Account" {...props}>
      <Content>
        <Connected>
          <Connector>Connected with {providerName}</Connector>
          <Disconnect size="xs" variant="outlined" onClick={handleDisconnect}>
            Disconnect
          </Disconnect>
        </Connected>
        {isChainSupported && <WalletModalContent />}
      </Content>
    </Modal>
  )
}
