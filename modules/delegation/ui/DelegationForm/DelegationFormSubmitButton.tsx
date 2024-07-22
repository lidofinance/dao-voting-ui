import { useMemo } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'
import { SubmitButton } from './DelegationFormStyle'
import { useFormState } from 'react-hook-form'

export function DelegationFormSubmitButton() {
  const { isWalletConnected } = useWeb3()
  const openConnectWalletModal = useConnectWalletModal()
  const { mode, aragonDelegateAddress, snapshotDelegateAddress } =
    useDelegationFormData()
  const { isSubmitting, errors } = useFormState()

  const buttonText = useMemo(() => {
    if (!isWalletConnected) {
      return null
    }
    if (mode === 'simple') {
      if (aragonDelegateAddress && snapshotDelegateAddress) {
        return `Redelegate on Aragon & Snapshot`
      }
      return `Delegate on Aragon & Snapshot`
    }

    const delegateAddress =
      mode === 'aragon' ? aragonDelegateAddress : snapshotDelegateAddress

    if (delegateAddress) {
      return 'Redelegate'
    }
    return 'Delegate'
  }, [aragonDelegateAddress, isWalletConnected, mode, snapshotDelegateAddress])

  if (!isWalletConnected) {
    return (
      <SubmitButton onClick={openConnectWalletModal}>
        Connect wallet to delegate
      </SubmitButton>
    )
  }

  return (
    <SubmitButton
      type="submit"
      loading={isSubmitting}
      disabled={!!errors['delegateAddress']}
    >
      {buttonText}
    </SubmitButton>
  )
}
