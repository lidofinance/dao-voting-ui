import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import { validateAddress } from 'modules/delegation/utils/validateAddress'
import { InputControl } from 'modules/shared/ui/Controls/Input'

export function DelegationAddressInput() {
  const { isWalletConnected, walletAddress } = useWeb3()
  const { loading } = useDelegationFormData()

  return (
    <InputControl
      autoComplete="off"
      name="delegateAddress"
      label="Delegate address"
      disabled={!isWalletConnected || loading.isDelegationInfoLoading}
      rules={{
        required: 'Field is required',
        validate: value => {
          const addressErr = validateAddress(value)
          if (addressErr) {
            return addressErr
          }
          if (walletAddress?.toLowerCase() === value.toLowerCase()) {
            return 'You cannot delegate to yourself'
          }

          return true
        },
      }}
    />
  )
}
