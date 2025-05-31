import { Text, useBreakpoint } from '@lidofinance/lido-ui'
import { DelegationSubtitleStyled } from './DelegationFormStyle'
import { useDelegationFormData } from 'modules/delegation/providers/DelegationFormContext'

import AragonSvg from 'assets/aragon.com.svg.react'
import SnapshotSvg from 'assets/snapshot.com.svg.react'

export function DelegationFormSubtitle() {
  const { mode } = useDelegationFormData()
  const isMobile = useBreakpoint('md')

  if (mode === 'aragon') {
    return (
      <DelegationSubtitleStyled>
        <AragonSvg />
        <Text size={isMobile ? 'sm' : 'md'} weight={700}>
          On Aragon
        </Text>
      </DelegationSubtitleStyled>
    )
  }

  if (mode === 'snapshot') {
    return (
      <DelegationSubtitleStyled>
        <SnapshotSvg />
        <Text size={isMobile ? 'sm' : 'md'} weight={700}>
          On Snapshot
        </Text>
      </DelegationSubtitleStyled>
    )
  }

  return null
}
