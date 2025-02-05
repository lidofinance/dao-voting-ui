import { DualGovernanceStatus } from 'modules/dual-governance/types'
import {
  DualGovernanceStatusButtonStyled,
  PopoverStyled,
} from './DualGovernanceStatusButtonStyle'
import { useRef, useState } from 'react'
import { themeDark, ThemeProvider } from '@lidofinance/lido-ui'

const STATUS = DualGovernanceStatus.Normal

export const DualGovernanceStatusButton = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const anchorRef = useRef<HTMLButtonElement>(null)

  return (
    <div>
      <DualGovernanceStatusButtonStyled
        $status={STATUS}
        onClick={() => setIsPopupOpen(true)}
        ref={anchorRef}
      />
      <ThemeProvider theme={themeDark}>
        <PopoverStyled
          open={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          anchorRef={anchorRef}
        >
          aboba
          {/* <DualGovernanceWidget /> */}
        </PopoverStyled>
      </ThemeProvider>
    </div>
  )
}
