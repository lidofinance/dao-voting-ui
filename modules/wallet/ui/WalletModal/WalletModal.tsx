import { useCallback, useMemo } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useDisconnect, useConnectorInfo } from 'reef-knot/web3-react'
import { useGovernanceTokenData } from 'modules/tokens/hooks/useGovernanceTokenData'
import { useConfig } from 'modules/config/hooks/useConfig'
import { CopyOpenActions } from 'modules/shared/ui/Common/CopyOpenActions'
import {
  Text,
  Modal,
  ModalProps,
  Identicon,
  trimAddress,
} from '@lidofinance/lido-ui'
import {
  Content,
  Connected,
  Connector,
  Disconnect,
  Row,
  Address,
} from './WalletModalStyle'
import { useDisconnect as useDisconnectWagmi } from 'wagmi'

function WalletModalContent() {
  const { walletAddress } = useWeb3()
  const trimmedAddress = useMemo(
    () => trimAddress(walletAddress ?? '', 6),
    [walletAddress],
  )
  const { data: tokenData, initialLoading } = useGovernanceTokenData()

  return (
    <>
      <Row>
        <Text
          size="xxs"
          weight={500}
          children={initialLoading ? 'Loading...' : 'Balance'}
        />
        {tokenData?.balanceStr ? (
          <Text size="xxs" weight={500} data-testid="balance">
            &nbsp;
            {tokenData.balanceStr}
          </Text>
        ) : null}
      </Row>

      <Row>
        <Identicon address={walletAddress ?? ''} />
        <Address data-testid="walletAddress">{trimmedAddress}</Address>
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
  const { disconnect: wagmiDisconnect } = useDisconnectWagmi()
  const { chainId } = useWeb3()
  const { supportedChainIds } = useConfig()
  const isChainSupported = useMemo(
    () => supportedChainIds.includes(chainId),
    [chainId, supportedChainIds],
  )

  const handleDisconnect = useCallback(() => {
    disconnect?.()
    wagmiDisconnect()
    onClose?.()
  }, [disconnect, wagmiDisconnect, onClose])

  return (
    <Modal title="Account" {...props}>
      <Content>
        <Connected>
          <Connector data-testid="providerName">
            Connected with {providerName}
          </Connector>
          <Disconnect
            size="xs"
            variant="outlined"
            onClick={handleDisconnect}
            data-testid="disconnectBtn"
          >
            Disconnect
          </Disconnect>
        </Connected>
        {isChainSupported && <WalletModalContent />}
      </Content>
    </Modal>
  )
}
