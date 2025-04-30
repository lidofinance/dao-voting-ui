import { useRef, useState } from 'react'
import { DualGovernanceStatus } from '../types'
import {
  DualGovernanceStatusButtonStyled,
  PopoverStyled,
} from './DualGovernanceStatusButtonStyle'
import { DualGovernanceWidget } from '../DualGovernanceWidget'
import { useDualGovernanceState } from '../useDualGovernanceState'
import { Loader } from '@lidofinance/lido-ui'
import { DGIcon } from './DGIcon'

export const DualGovernanceStatusButton = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  const { data, initialLoading } = useDualGovernanceState()

  const handleButtonClick = () => {
    if (!data) return
    setIsPopupOpen(true)
  }

  return (
    <div>
      <DualGovernanceStatusButtonStyled
        $status={data?.status ?? DualGovernanceStatus.Unset}
        disabled={initialLoading}
        onClick={handleButtonClick}
        ref={anchorRef}
        icon={initialLoading ? <Loader /> : DGIcon}
      />
      {!!data && (
        <PopoverStyled
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          anchorRef={anchorRef}
        >
          <DualGovernanceWidget dualGovernanceState={data} />
        </PopoverStyled>
      )}
    </div>
  )
}
