import Link from 'next/link'
import { AttentionBanner } from '../AttentionBanner'
import { ErrorMessageDisplayText } from 'modules/shared/utils/getErrorMessage'
import * as urls from 'modules/network/utils/urls'

type Props = {
  error: unknown
}

export const FetchErrorBanner = ({ error }: Props) => {
  let topLine = 'There is a problem with rpc node currently in use.'

  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 429
  ) {
    topLine = ErrorMessageDisplayText.RPC_TOO_MANY_REQUESTS
  }

  return (
    <AttentionBanner type="error">
      {topLine}
      <br />
      You can set your own url on <Link href={urls.settings}>
        settings
      </Link>{' '}
      page.
    </AttentionBanner>
  )
}
