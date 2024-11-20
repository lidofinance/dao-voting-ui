import { useEffect, useState } from 'react'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import { PublicDelegate } from 'modules/delegation/types'
import { getPublicDelegateByAddress } from 'modules/delegation/utils/getPublicDelegateName'
import { DelegationFormFootNoteStyled } from './DelegationFormStyle'
import { isValidAddress } from 'modules/shared/utils/addressValidation'

export function DelegationFormPublicDelegateTooltip() {
  const { watch } = useDelegationFormData()
  const [selectedPublicDelegate, setSelectedPublicDelegate] =
    useState<PublicDelegate | null>(null)

  useEffect(() => {
    const { unsubscribe } = watch(({ delegateAddress }) => {
      if (isValidAddress(delegateAddress)) {
        const publicDelegate = getPublicDelegateByAddress(delegateAddress)

        if (!publicDelegate && selectedPublicDelegate) {
          setSelectedPublicDelegate(null)
        } else if (
          publicDelegate &&
          publicDelegate.address !== selectedPublicDelegate?.address
        ) {
          setSelectedPublicDelegate(publicDelegate)
        }
      } else if (selectedPublicDelegate) {
        setSelectedPublicDelegate(null)
      }
    })
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watch, selectedPublicDelegate])

  if (!selectedPublicDelegate) return null

  return (
    <DelegationFormFootNoteStyled>
      Public delegate: <b>{selectedPublicDelegate.name}</b>
    </DelegationFormFootNoteStyled>
  )
}
