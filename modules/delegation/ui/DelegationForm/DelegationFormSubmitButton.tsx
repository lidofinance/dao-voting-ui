import { useMemo } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import { useConnectWalletModal } from 'modules/wallet/ui/ConnectWalletModal'
import { SubmitButton } from './DelegationFormStyle'
import { useFormState } from 'react-hook-form'
import { hasIncorrectLength } from 'modules/delegation/utils/hasIncorrectLength'

export function DelegationFormSubmitButton() {
  const { isWalletConnected } = useWeb3()
  const openConnectWalletModal = useConnectWalletModal()
  const {
    mode,
    isSubmitting,
    aragonDelegateAddress,
    snapshotDelegateAddress,
    watch,
  } = useDelegationFormData()
  const { errors } = useFormState()
  const [delegateAddressInput] = watch(['delegateAddress'])

  const buttonText = useMemo(() => {
    if (!isWalletConnected) {
      return null
    }
    const isInputMatchAragon = Boolean(
      delegateAddressInput &&
        `${delegateAddressInput}`.toLowerCase() ===
          `${aragonDelegateAddress}`.toLowerCase(),
    )
    const isInputMatchSnapshot = Boolean(
      delegateAddressInput &&
        `${delegateAddressInput}`.toLowerCase() ===
          `${snapshotDelegateAddress}`.toLowerCase(),
    )

    if (mode === 'simple') {
      return `
      ${
        (aragonDelegateAddress && !isInputMatchAragon) ||
        (snapshotDelegateAddress && !isInputMatchSnapshot)
          ? 'Redelegate'
          : 'Delegate'
      }
      ${!isInputMatchAragon || !isInputMatchSnapshot ? ' on ' : ''} 
      ${isInputMatchAragon ? '' : 'Aragon'}
      ${!isInputMatchAragon && !isInputMatchSnapshot ? ' & ' : ''}
      ${isInputMatchSnapshot ? '' : 'Snapshot'}`
    }

    const delegateAddress =
      mode === 'aragon' ? aragonDelegateAddress : snapshotDelegateAddress

    if (delegateAddress) {
      return 'Redelegate'
    }
    return 'Delegate'
  }, [
    aragonDelegateAddress,
    isWalletConnected,
    mode,
    snapshotDelegateAddress,
    delegateAddressInput,
  ])
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
      disabled={Boolean(
        hasIncorrectLength(delegateAddressInput ?? '') ||
          errors['delegateAddress']?.message,
      )}
    >
      {buttonText}
    </SubmitButton>
  )
}
