import { Identicon, trimAddress } from '@lidofinance/lido-ui'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'
import { AddressBadgeWrap } from './AddressBadgeStyle'

type Props = {
  address: string
  className?: string
}

export function AddressBadge({ address, className }: Props) {
  return (
    <AddressPop address={address}>
      <AddressBadgeWrap className={className}>
        <Identicon address={address} diameter={16} />
        {trimAddress(address, 4)}
      </AddressBadgeWrap>
    </AddressPop>
  )
}
