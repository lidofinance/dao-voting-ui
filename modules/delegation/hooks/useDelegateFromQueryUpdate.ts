import { UseFormReturn } from 'react-hook-form'
import { DelegationFormInput } from '../types'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { isValidAddress } from 'modules/shared/utils/addressValidation'

export const useDelegateFromQueryUpdate = (
  formObject: UseFormReturn<DelegationFormInput>,
) => {
  const { query } = useRouter()

  const { getValues, setValue, setFocus } = formObject

  useEffect(() => {
    const currentValue = getValues('delegateAddress')
    const queryAddress = query.delegateAddress as string | undefined
    if (
      queryAddress &&
      isValidAddress(queryAddress) &&
      currentValue?.toLowerCase() !== queryAddress.toLowerCase()
    ) {
      setValue('delegateAddress', queryAddress, {
        shouldValidate: true,
      })
      setFocus('delegateAddress')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.delegateAddress])
}
