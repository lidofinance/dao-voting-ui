import styled from 'styled-components'
import { Block } from '@lidofinance/lido-ui'
import { BREAKPOINT_MOBILE } from '../../../globalStyles'

export const ProposalListItemWrapper = styled(Block)`
  font-size: 26px;
  border: 1px solid var(--border-color-fog);
  cursor: pointer;
  padding: 30px;
  margin-right: 20px;
  min-width: 325px;
  height: 280px;
  @media ${`screen and (max-width: ${BREAKPOINT_MOBILE})`} {
    flex-direction: column;
  }
`

export const SummarySection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: ${({ theme }) => theme.spaceMap.md}px;
`

export const ProposalDescription = styled.div`
  margin-left: auto;
  padding-top: ${({ theme }) => theme.spaceMap.md}px;
  word-wrap: break-word;
  flex-shrink: 0;
  border-top: 1px solid #0000001a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`

export const StatusBadgeWrapper = styled.div`
  display: flex;
`
