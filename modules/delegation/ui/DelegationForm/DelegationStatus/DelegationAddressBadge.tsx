import { Identicon, Text, trimAddress } from '@lidofinance/lido-ui'
import { AddressPop } from 'modules/shared/ui/Common/AddressPop'
import {
  AddressBadgeWrap,
  RevokeDelegationButton,
  DelegationAddressBadgeStyled,
} from './DelegationStatusStyle'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'
import { DelegationType, PublicDelegate } from 'modules/delegation/types'
import { useConfirmRevokeModal } from './ConfirmRevokeModal'
import { PublicDelegateAvatar } from '../../PublicDelegateAvatar'

type Props = {
  address: string
  publicDelegate: PublicDelegate | null | undefined
  type: DelegationType
}

export function DelegationAddressBadge({
  address,
  publicDelegate,
  type,
}: Props) {
  const { isSubmitting, onRevoke } = useDelegationFormData()
  const { openModal: openConfirmModal } = useConfirmRevokeModal({
    title: `Revoke ${type} delegation?`,
    onRevoke: onRevoke(type),
  })

  return (
    <DelegationAddressBadgeStyled>
      <AddressPop address={address}>
        <AddressBadgeWrap>
          {publicDelegate ? (
            <PublicDelegateAvatar avatarSrc={publicDelegate.avatar} size={20} />
          ) : (
            <Identicon address={address} diameter={20} />
          )}
          <Text
            as="span"
            size="xxs"
            color={publicDelegate ? 'default' : 'secondary'}
          >
            {publicDelegate?.name ?? trimAddress(address, 4)}
          </Text>
        </AddressBadgeWrap>
      </AddressPop>
      <RevokeDelegationButton
        disabled={isSubmitting}
        onClick={() => openConfirmModal()}
      />
    </DelegationAddressBadgeStyled>
  )
}
