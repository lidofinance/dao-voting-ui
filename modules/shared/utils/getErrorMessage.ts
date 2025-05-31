export const ErrorMessageDisplayText = {
  NOT_ENOUGH_ETHER: 'Not enough ether for gas.',
  DENIED_SIG: 'User denied the transaction signature.',
  SOMETHING_WRONG: 'Something went wrong.',
  ENABLE_BLIND_SIGNING:
    'Please enable blind signing on your Ledger hardware wallet.',
  LIMIT_REACHED:
    'Transaction could not be completed because stake limit is exhausted. Please wait until the stake limit restores and try again. Otherwise, you can swap your Ethereum on 1inch platform instantly.',
  RPC_TOO_MANY_REQUESTS:
    'RPC service has reached its requests limit or compute capacity.',
} as const

// type safe error code extractor
const extractCodeFromError = (
  error: unknown,
  shouldDig = true,
): number | string => {
  // early exit on non object error
  if (!error || typeof error != 'object') return 0

  if ('reason' in error) {
    if (typeof error.reason == 'string' && error.reason.includes('STAKE_LIMIT'))
      return 'LIMIT_REACHED'
    // TODO: error.reason more cases
  }

  // sometimes we have error message but bad error code
  if ('message' in error && typeof error.message == 'string') {
    const normalizedMessage = error.message.toLowerCase()
    if (
      normalizedMessage.includes('denied message signature') ||
      normalizedMessage.includes('transaction was rejected') ||
      normalizedMessage.includes('rejected the transaction') ||
      normalizedMessage.includes('rejected the request') ||
      normalizedMessage.includes('rejected transaction')
    )
      return 'ACTION_REJECTED'
  }

  // Ledger live errors
  if (
    'data' in error &&
    typeof error.data === 'object' &&
    Array.isArray(error.data) &&
    typeof error.data['0'] === 'object' &&
    typeof error.data['0'].message === 'string'
  ) {
    if (error.data['0'].message.toLowerCase().includes('rejected'))
      return 'ACTION_REJECTED'
  }

  if ('name' in error && typeof error.name == 'string') {
    if (error.name.toLocaleLowerCase() === 'ethapppleaseenablecontractdata')
      return 'ENABLE_BLIND_SIGNING'
  }
  if ('code' in error) {
    if (typeof error.code === 'string') return error.code.toUpperCase()
    if (typeof error.code == 'number') return error.code
  }

  // errors are sometimes nested :(
  if ('error' in error && shouldDig && error.error) {
    return extractCodeFromError(error.error, false)
  }

  return 0
}

export const getErrorMessage = (error: unknown) => {
  try {
    console.error('TX_ERROR:', { error, error_string: JSON.stringify(error) })
  } catch (e) {
    console.error('TX_ERROR:', e)
  }

  const code = extractCodeFromError(error)
  switch (code) {
    case -32000:
    case 3:
    case 'UNPREDICTABLE_GAS_LIMIT':
    case 'INSUFFICIENT_FUNDS':
      return ErrorMessageDisplayText.NOT_ENOUGH_ETHER
    case 'ACTION_REJECTED':
    case 4001:
      return ErrorMessageDisplayText.DENIED_SIG
    case 'LIMIT_REACHED':
      return ErrorMessageDisplayText.LIMIT_REACHED
    case 'ENABLE_BLIND_SIGNING':
      return ErrorMessageDisplayText.ENABLE_BLIND_SIGNING
    case 429:
      return ErrorMessageDisplayText.RPC_TOO_MANY_REQUESTS
    default:
      return ErrorMessageDisplayText.SOMETHING_WRONG
  }
}
