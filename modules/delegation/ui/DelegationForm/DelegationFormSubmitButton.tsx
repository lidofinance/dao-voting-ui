import { MouseEventHandler, useCallback, useMemo, useRef } from 'react'
import { useWeb3 } from 'modules/blockChain/hooks/useWeb3'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import { useConnect } from 'reef-knot/core-react'
import { DelegateButton, HiddenButton } from './DelegationFormStyle'
import { useConfirmReDelegateModal } from './ConfirmReDelegateModal'
import { Text } from '@lidofinance/lido-ui'

type Props = {
  onCustomizeClick?: () => void
}

export function DelegationFormSubmitButton({ onCustomizeClick }: Props) {
  const { isWalletConnected } = useWeb3()
  const { connect } = useConnect()
  const {
    mode,
    isSubmitting,
    aragonDelegateAddress,
    snapshotDelegateAddress,
    watch,
  } = useDelegationFormData()
  const ref = useRef<HTMLButtonElement>(null)

  const submitFromModal = useCallback(() => {
    ref.current?.click()
  }, [ref])

  const isSimple = mode === 'simple'
  const [delegateAddressInput] = watch(['delegateAddress'])

  const match = useMemo(() => {
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
    const isRedelegateAragon = aragonDelegateAddress && !isInputMatchAragon
    const isRedelegateSnapshot =
      snapshotDelegateAddress && !isInputMatchSnapshot

    const isRedelegate = isRedelegateAragon || isRedelegateSnapshot
    return {
      isInputMatchAragon,
      isInputMatchSnapshot,
      isRedelegate,
      isRedelegateAragon,
      isRedelegateSnapshot,
    }
  }, [aragonDelegateAddress, delegateAddressInput, snapshotDelegateAddress])

  const buttonText = useMemo(() => {
    if (!isWalletConnected) {
      return null
    }

    if (isSimple) {
      return `
      ${match.isRedelegate ? 'Redelegate' : 'Delegate'}
      ${!match.isInputMatchAragon || !match.isInputMatchSnapshot ? ' on ' : ''}
      ${match.isInputMatchAragon ? '' : 'Aragon'}
      ${!match.isInputMatchAragon && !match.isInputMatchSnapshot ? ' & ' : ''}
      ${match.isInputMatchSnapshot ? '' : 'Snapshot'}`
    }

    const delegateAddress =
      mode === 'aragon' ? aragonDelegateAddress : snapshotDelegateAddress

    if (delegateAddress) {
      return 'Redelegate'
    }
    return 'Delegate'
  }, [
    isWalletConnected,
    isSimple,
    mode,
    aragonDelegateAddress,
    snapshotDelegateAddress,
    match,
  ])

  const subtitle = useMemo(() => {
    const start = `
      ${match.isRedelegateAragon ? 'Aragon' : ''}
      ${match.isRedelegateAragon && match.isRedelegateSnapshot ? ' & ' : ''}
      ${match.isRedelegateSnapshot ? 'Snapshot' : ''}
    `.trim()
    const end = `
      ${match.isRedelegateAragon && match.isRedelegateSnapshot ? 'one' : 'on '}
      ${!match.isRedelegateAragon ? 'Aragon' : ''}
      ${!match.isRedelegateAragon && !match.isRedelegateSnapshot ? ' & ' : ''}
      ${!match.isRedelegateSnapshot ? 'Snapshot' : ''}
    `.trim()
    return (
      <>
        <Text
          size="xs"
          color="secondary"
        >{`You are about to redelegate on ${start}.`}</Text>
        <Text
          size="xs"
          color="secondary"
        >{`To change only ${end}, use Customize`}</Text>
      </>
    )
  }, [match])

  const { openModal: openConfirmReDelegateModal } = useConfirmReDelegateModal()

  const onSubmitDialog: MouseEventHandler<HTMLButtonElement> = event => {
    // this prevents form being submitted by Enter keypress on the input
    event.preventDefault()
    openConfirmReDelegateModal({
      onAlternative: onCustomizeClick,
      onSubmit: submitFromModal,
      subtitle,
    })
  }

  if (!isWalletConnected) {
    return (
      <DelegateButton onClick={connect} type="button">
        Connect wallet
      </DelegateButton>
    )
  }

  if (!match.isRedelegate || !isSimple) {
    return (
      <DelegateButton type="submit" loading={isSubmitting}>
        {buttonText}
      </DelegateButton>
    )
  }

  return (
    <>
      <DelegateButton
        type="submit"
        loading={isSubmitting}
        onClick={onSubmitDialog}
      >
        {buttonText}
      </DelegateButton>
      <HiddenButton ref={ref} type="submit" />
    </>
  )
}
