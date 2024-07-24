import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import {
  StatusesWrap,
  StatusLabel,
  DelegationStatusStyled,
  StatusValue,
  StatusWithIcon,
} from './DelegationStatusStyle'
import { DelegationAddressBadge } from './DelegationAddressBadge'

import AragonSvg from 'assets/aragon.com.svg.react'
import SnapshotSvg from 'assets/snapshot.com.svg.react'

export function DelegationStatus() {
  const { isWalletConnected } = useWeb3()
  const { mode, aragonDelegateAddress, snapshotDelegateAddress, loading } =
    useDelegationFormData()

  if (!isWalletConnected) {
    return null
  }

  if (mode === 'simple') {
    return (
      <StatusesWrap>
        <DelegationStatusStyled>
          <StatusWithIcon>
            <AragonSvg />
            <StatusLabel>On Aragon</StatusLabel>
          </StatusWithIcon>
          {aragonDelegateAddress ? (
            <DelegationAddressBadge
              address={aragonDelegateAddress}
              type="aragon"
            />
          ) : (
            <StatusValue>
              {loading.isDelegationInfoLoading ? 'Loading...' : 'Not delegated'}
            </StatusValue>
          )}
        </DelegationStatusStyled>
        <DelegationStatusStyled>
          <StatusWithIcon>
            <SnapshotSvg />
            <StatusLabel>On Snapshot</StatusLabel>
          </StatusWithIcon>
          {snapshotDelegateAddress ? (
            <DelegationAddressBadge
              address={snapshotDelegateAddress}
              type="snapshot"
            />
          ) : (
            <StatusValue>
              {loading.isDelegationInfoLoading ? 'Loading...' : 'Not delegated'}
            </StatusValue>
          )}
        </DelegationStatusStyled>
      </StatusesWrap>
    )
  }

  const delegateAddress =
    mode === 'aragon' ? aragonDelegateAddress : snapshotDelegateAddress

  return (
    <DelegationStatusStyled>
      <StatusLabel>Delegated to</StatusLabel>
      {delegateAddress ? (
        <DelegationAddressBadge address={delegateAddress} type={mode} />
      ) : (
        <StatusValue>
          {loading.isDelegationInfoLoading ? 'Loading...' : 'Not delegated'}
        </StatusValue>
      )}
    </DelegationStatusStyled>
  )
}
