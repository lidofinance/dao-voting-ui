import { useClickAway } from 'react-use'
import { useCallback, useEffect, useRef } from 'react'
import { useSimpleReducer } from 'modules/shared/hooks/useSimpleReducer'

import { CopyOpenActions } from 'modules/shared/ui/Common/CopyOpenActions'
import { IdenticonBadge } from '@lidofinance/lido-ui'
import { Wrap, Pop, BadgeWrap } from './AddressPopStyle'

import { calcPopoverPosition } from './calcPopoverPosition'

type Props = React.ComponentProps<typeof IdenticonBadge>

export function AddressPop({ children, ...badgeProps }: Props) {
  const { address } = badgeProps

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const popRef = useRef<HTMLDivElement | null>(null)

  const [{ isOpened, position }, setState] = useSimpleReducer<{
    isOpened: boolean
    position?: { left: number; top: number }
  }>({
    isOpened: false,
    position: undefined,
  })

  const handleOpen = useCallback(
    (event: React.MouseEvent) => {
      // To avoid opening a vote when clicking on the pop from the dashboard
      event.preventDefault()
      setState({ isOpened: true })
    },
    [setState],
  )

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
        </Pop>
      )}
    </Wrap>
  )
}
