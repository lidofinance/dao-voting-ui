import styled from 'styled-components'
import { VotePhasesTooltip } from '../VotePhasesTooltip'

export const Actions = styled.div`
  display: flex;
  gap: 16px;

  > * {
    flex: 1 1 auto;
  }
`

export const PhasesTooltip = styled(VotePhasesTooltip)`
  display: flex;

  > * {
    flex: 1 1 auto;
  }
`
