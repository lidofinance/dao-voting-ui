import { ModalProps, Modal, Text, Button } from '@lidofinance/lido-ui'
import { WarningIcon, ButtonGroup } from './DualGovernanceWarningModalStyle'
import { getDualGovernanceLink } from '../utils'
import { useWeb3 } from '../../blockChain/hooks/useWeb3'
import { useCallback } from 'react'

export function DualGovernanceWarningModal({ ...modalProps }: ModalProps) {
  const { chainId } = useWeb3()
  const handleButtonClick = useCallback(() => {
    open(getDualGovernanceLink(chainId))
  }, [chainId])

  return (
    <Modal
      title={
        <Text strong size="sm">
          Governance Blocked
        </Text>
      }
      center
      {...modalProps}
      titleIcon={<WarningIcon width="60px" height="50px" viewBox="0 0 14 12" />}
    >
      <Text size="xs" color="secondary">
        Lido governance is currently blocked.
        <br />
        stETH holders are vetoing decisions made by LDO holders
      </Text>
      <br />
      <Text size="xs" color="secondary">
        Until this is resolved, the DAO may be unable to execute any decisions
      </Text>

      <ButtonGroup>
        <Button size="sm" onClick={handleButtonClick}>
          See details
        </Button>

        <Button
          size="sm"
          variant="outlined"
          color="error"
          onClick={modalProps.onClose}
        >
          Continue anyway
        </Button>
      </ButtonGroup>
    </Modal>
  )
}
