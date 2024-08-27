import { Identicon, Text, trimAddress } from '@lidofinance/lido-ui'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'
import {
  AddressBadgeWrap,
  DelegatorsListItemStyled,
} from './DelegatorsListStyle'
import { formatBalance } from 'modules/blockChain/utils/formatBalance'
import { BigNumber } from 'ethers'

type Props = {
  address: string
  balance: BigNumber
  ensName: string | null | undefined
  governanceSymbol: string | undefined
}

export function DelegatorsListItem({
  address,
  balance,
  governanceSymbol,
  ensName,
}: Props) {
  return (
    <DelegatorsListItemStyled key={address}>
      <AddressPop address={address}>
        <AddressBadgeWrap>
          <Identicon address={address} diameter={20} />
          <Text as="span" size="xxs">
            {ensName ?? trimAddress(address, 6)}
          </Text>
        </AddressBadgeWrap>
      </AddressPop>
      <Text size="xs">
        {formatBalance(balance)} {governanceSymbol ?? ''}
      </Text>
    </DelegatorsListItemStyled>
  )
}
