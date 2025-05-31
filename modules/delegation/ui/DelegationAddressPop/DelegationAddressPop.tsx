import { useClickAway } from 'react-use'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useSimpleReducer } from 'modules/shared/hooks/useSimpleReducer'

import { CopyOpenActions } from 'modules/shared/ui/Common/CopyOpenActions'
import { IdenticonBadge, Text } from '@lidofinance/lido-ui'
import UnionIcon from 'assets/union.com.svg.react'

import {
  Wrap,
  Pop,
  BadgeWrap,
  IdenticonBadgeWrap,
  VotedBy,
  PublicDelegateWrap,
} from './PopStyle'

import { calcPopoverPosition } from './calcPopoverPosition'
import { getPublicDelegateByAddress } from 'modules/delegation/utils/getPublicDelegateName'
import { PublicDelegateAvatar } from '../PublicDelegateAvatar'

type IdenticonBadgeProps = React.ComponentProps<typeof IdenticonBadge>

type Props = IdenticonBadgeProps & {
  delegateAddress: string | null
  children: React.ReactNode
}

export function DelegationAddressPop({ children, ...badgeProps }: Props) {
  const { address, delegateAddress } = badgeProps
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const popRef = useRef<HTMLDivElement | null>(null)

  const [{ isOpened, position }, setState] = useSimpleReducer<{
    isOpened: boolean
    position?: { left: number; top: number }
  }>({
    isOpened: false,
    position: undefined,
  })

  const handleOpen = useCallback(() => {
    setState({ isOpened: true })
  }, [setState])

  const publicDelegate = useMemo(() => {
    if (!delegateAddress) return null
    return getPublicDelegateByAddress(delegateAddress)
  }, [delegateAddress])

  useEffect(() => {
    const wrapEl = wrapRef.current
    const popEl = popRef.current

    if (!wrapEl || !popEl || !isOpened || position) return

    setState({ position: calcPopoverPosition(wrapEl, popEl) })
  }, [isOpened, position, setState])

  useClickAway(popRef, () => setState({ isOpened: false, position: undefined }))

  return (
    <Wrap ref={wrapRef}>
      <span onClick={handleOpen}>{children}</span>
      {isOpened && (
        <Pop ref={popRef} isVisible={Boolean(position)} style={position}>
          <div>
            <BadgeWrap>
              <IdenticonBadge
                {...badgeProps}
                style={{ margin: 0 }}
                diameter={30}
                symbols={80}
                onClick={handleOpen}
              />
            </BadgeWrap>
            <CopyOpenActions value={address} entity="address" />
          </div>
          {delegateAddress && (
            <div>
              <VotedBy>
                <UnionIcon />
                <Text size="xxs">Voted By</Text>
              </VotedBy>
              <BadgeWrap>
                {publicDelegate ? (
                  <PublicDelegateWrap>
                    <Text color="secondary" size="xs" as="span">
                      {publicDelegate.name}
                    </Text>
                    <PublicDelegateAvatar
                      avatarSrc={publicDelegate.avatar}
                      size={30}
                    />
                  </PublicDelegateWrap>
                ) : (
                  <IdenticonBadgeWrap
                    {...badgeProps}
                    address={delegateAddress}
                    diameter={30}
                    symbols={80}
                    onClick={handleOpen}
                  />
                )}
              </BadgeWrap>
              <CopyOpenActions value={delegateAddress} entity="address" />
            </div>
          )}
        </Pop>
      )}
    </Wrap>
  )
}
