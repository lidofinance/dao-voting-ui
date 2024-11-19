import { UseFormReturn } from 'react-hook-form'
import { DelegationFormInput } from '../types'
import { useDelegateFromPublicList } from '../providers/DelegateFromPublicListContext'
import { useEffect } from 'react'
import { isValidAddress } from 'modules/shared/utils/addressValidation'

export const useDelegateFromPublicListUpdate = (
  formObject: UseFormReturn<DelegationFormInput>,
) => {
  const { selectedPublicDelegate, onPublicDelegateReset } =
    useDelegateFromPublicList()

  const { getValues, setValue, setFocus } = formObject

  useEffect(() => {
    const currentValue = getValues('delegateAddress')
    if (
      selectedPublicDelegate &&
      isValidAddress(selectedPublicDelegate) &&
      currentValue?.toLowerCase() !== selectedPublicDelegate.toLowerCase()
    ) {
      setValue('delegateAddress', selectedPublicDelegate, {
        shouldValidate: true,
      })
      setFocus('delegateAddress')
      onPublicDelegateReset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPublicDelegate])
}
