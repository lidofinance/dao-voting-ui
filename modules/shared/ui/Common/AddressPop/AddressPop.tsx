import { useClickAway } from 'react-use'
import { useCallback, useEffect, useRef } from 'react'
import { useSimpleReducer } from 'modules/shared/hooks/useSimpleReducer'

import { CopyOpenActions } from 'modules/shared/ui/Common/CopyOpenActions'
import { IdenticonBadge } from '@lidofinance/lido-ui'
import { Wrap, Pop, BadgeWrap } from './AddressPopStyle'

import { minmax } from 'modules/shared/utils/minmax'

type BadgeProps = React.ComponentProps<typeof IdenticonBadge>

type Props = BadgeProps & {
  children?: React.ReactNode
}

export function AddressPop({ children, ...badgeProps }: Props) {
  const { address } = badgeProps

  const wrapRef = useRef<HTMLDivElement | null>(null)
  const popRef = useRef<HTMLDivElement | null>(null)

  const [{ isOpened, position }, setState] = useSimpleReducer({
    isOpened: false,
    position: undefined as { left: number; top: number } | undefined,
  })

  const handleOpen = useCallback(() => {
    setState({ isOpened: true })
  }, [setState])

  useEffect(() => {
    if (isOpened && !position) {
      const wrapEl = wrapRef.current
      const popEl = popRef.current
      if (!wrapEl || !popEl) return

      const wrapBox = wrapEl.getBoundingClientRect()
      const popBox = popEl.getBoundingClientRect()

      const left = wrapBox.left + wrapBox.width / 2 - popBox.width / 2
      const top = wrapBox.top + wrapBox.height / 2 - popBox.height / 2

      const nextPosition = {
        left: minmax(10, left, window.innerWidth - popBox.width - 10),
        top: minmax(10, top, window.innerHeight - popBox.height - 10),
      }

      setState({ position: nextPosition })
    }
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
