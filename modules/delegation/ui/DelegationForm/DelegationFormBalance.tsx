import { Text } from '@lidofinance/lido-ui'
import { useFormState } from 'react-hook-form'
import {
  Balance,
  CustomizeButton,
  DelegationFormBalanceStyled,
} from './DelegationFormStyle'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'

type Props = {
  onCustomizeClick?: () => void
}

export function DelegationFormBalance({ onCustomizeClick }: Props) {
  const { governanceBalanceStr, loading } = useDelegationFormData()
  const { isWalletConnected } = useWeb3()
  const { errors } = useFormState()

  if (!isWalletConnected) {
    return null
  }

  return (
    <DelegationFormBalanceStyled $withError={!!errors['delegateAddress']}>
      <Balance>
        <Text>Your voting power</Text>
        <Text weight={700}>
          {loading.isGovernanceBalanceLoading
            ? 'Loading...'
            : governanceBalanceStr}
        </Text>
      </Balance>
      {onCustomizeClick && (
        <CustomizeButton onClick={onCustomizeClick}>Customize</CustomizeButton>
      )}
    </DelegationFormBalanceStyled>
  )
}
