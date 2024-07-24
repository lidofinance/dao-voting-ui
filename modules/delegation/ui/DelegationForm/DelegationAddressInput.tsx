import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import { validateAddress } from 'modules/delegation/utils/validateAddress'
import { InputControl } from 'modules/shared/ui/Controls/Input'

export function DelegationAddressInput() {
  const { isWalletConnected, walletAddress } = useWeb3()
  const {
    loading,
    isSubmitting,
    aragonDelegateAddress,
    snapshotDelegateAddress,
    mode,
  } = useDelegationFormData()

  return (
    <InputControl
      autoComplete="off"
      name="delegateAddress"
      label="Delegate address"
      disabled={
        !isWalletConnected || loading.isDelegationInfoLoading || isSubmitting
      }
      rules={{
        required: 'Field is required',
        validate: value => {
          const addressErr = validateAddress(value)
          if (addressErr) {
            return addressErr
          }
          const loweredValue = value.toLowerCase()
          if (walletAddress?.toLowerCase() === loweredValue) {
            return 'You cannot delegate to yourself'
          }
          if (
            mode === 'simple' &&
            loweredValue === aragonDelegateAddress &&
            loweredValue === snapshotDelegateAddress
          ) {
            return 'You cannot delegate to the same address'
          } else if (mode !== 'simple') {
            const delegate =
              mode === 'aragon'
                ? aragonDelegateAddress
                : snapshotDelegateAddress
            if (loweredValue === delegate) {
              return 'You cannot delegate to the same address'
            }
          }

          return true
        },
      }}
    />
  )
}
