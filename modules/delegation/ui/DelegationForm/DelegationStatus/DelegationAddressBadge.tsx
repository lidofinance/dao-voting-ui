import { Identicon, Text, trimAddress } from '@lidofinance/lido-ui'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'
import {
  AddressBadgeWrap,
  RevokeDelegationButton,
  DelegationAddressBadgeStyled,
} from './DelegationStatusStyle'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import { DelegationType } from 'modules/delegation/types'
import { useConfirmRevokeModal } from './ConfirmRevokeModal'

type Props = {
  address: string
  type: DelegationType
}

export function DelegationAddressBadge({ address, type }: Props) {
  const { isSubmitting, onRevoke } = useDelegationFormData()
  const openConfirmModal = useConfirmRevokeModal({
    onRevoke: onRevoke(type),
  })
  return (
    <DelegationAddressBadgeStyled>
      <AddressPop address={address}>
        <AddressBadgeWrap>
          <Identicon address={address} diameter={20} />
          <Text as="span" size="xxs" color="secondary">
            {trimAddress(address, 4)}
          </Text>
        </AddressBadgeWrap>
      </AddressPop>
      <RevokeDelegationButton
        disabled={isSubmitting}
        onClick={openConfirmModal}
      />
    </DelegationAddressBadgeStyled>
  )
}
