import { Checkbox, CheckboxProps, Link } from '@lidofinance/lido-ui'
import { TermsStyle, TermsTextStyle } from './ConnectWalletModalTermsStyle'

type Props = Pick<CheckboxProps, 'checked' | 'onChange'>

export function ConnectWalletModalTerms(props: Props) {
  return (
    <TermsStyle>
      <Checkbox {...props} />
      <TermsTextStyle>
        I have read and accept{' '}
        <Link href="https://lido.fi/terms-of-use">Terms of Service</Link> and{' '}
        <Link href="https://lido.fi/privacy-notice">Privacy Notice</Link>.
      </TermsTextStyle>
    </TermsStyle>
  )
}
