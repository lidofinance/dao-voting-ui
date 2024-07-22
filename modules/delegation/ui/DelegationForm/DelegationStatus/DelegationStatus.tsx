import { useMemo } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { getChainName } from 'modules/blockChain/chains'
import { AddressBadge } from 'modules/shared/ui/Common/AddressBadge'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import {
  DelegationStatuses,
  DelegationStatusLabel,
  DelegationStatusStyled,
  DelegationStatusValue,
  DelegationStatusWithIcon,
} from '../DelegationFormStyle'

import AragonSvg from 'assets/aragon.com.svg.react'
import SnapshotSvg from 'assets/snapshot.com.svg.react'
// import CrossSVG from 'assets/cross.com.svg.react'

export function DelegationStatus() {
  const { chainId, isWalletConnected } = useWeb3()
  const {
    mode,
    aragonDelegateAddress,
    snapshotDelegateAddress,
    isSnapshotDelegationSupported,
    loading,
  } = useDelegationFormData()

  const notDelegatedText = useMemo(() => {
    if (loading.isDelegationInfoLoading) {
      return 'Loading...'
    }
    if (mode === 'snapshot' && !isSnapshotDelegationSupported) {
      return `Not supported on ${getChainName(chainId)}`
    }
    return 'Not delegated'
  }, [
    chainId,
    isSnapshotDelegationSupported,
    loading.isDelegationInfoLoading,
    mode,
  ])

  if (!isWalletConnected) {
    return null
  }

  if (mode === 'simple') {
    return (
      <DelegationStatuses>
        <DelegationStatusStyled>
          <DelegationStatusWithIcon>
            <AragonSvg />
            <DelegationStatusLabel>On Aragon</DelegationStatusLabel>
          </DelegationStatusWithIcon>
          {aragonDelegateAddress ? (
            <AddressBadge address={aragonDelegateAddress} />
          ) : (
            <DelegationStatusValue>{notDelegatedText}</DelegationStatusValue>
          )}
        </DelegationStatusStyled>
        <DelegationStatusStyled>
          <DelegationStatusWithIcon>
            <SnapshotSvg />
            <DelegationStatusLabel>On Snapshot</DelegationStatusLabel>
          </DelegationStatusWithIcon>
          {snapshotDelegateAddress ? (
            <AddressBadge address={snapshotDelegateAddress} />
          ) : (
            <DelegationStatusValue>{notDelegatedText}</DelegationStatusValue>
          )}
        </DelegationStatusStyled>
      </DelegationStatuses>
    )
  }

  const delegateAddress =
    mode === 'aragon' ? aragonDelegateAddress : snapshotDelegateAddress

  return (
    <DelegationStatusStyled>
      <DelegationStatusLabel>Delegated to</DelegationStatusLabel>
      {delegateAddress ? (
        <AddressBadge address={delegateAddress} />
      ) : (
        <DelegationStatusValue>{notDelegatedText}</DelegationStatusValue>
      )}
    </DelegationStatusStyled>
  )
}
