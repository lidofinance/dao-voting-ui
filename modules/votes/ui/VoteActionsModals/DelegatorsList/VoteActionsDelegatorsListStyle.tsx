import styled from 'styled-components'
import { Accordion, Text } from '@lidofinance/lido-ui'

export const SummaryWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const SummaryAmount = styled.div`
  padding: 4px 10px;
  border-radius: 14px;
  background: var(--lido-color-backgroundSecondary);
  display: flex;
  flex-shrink: 0;
  gap: 4px;
`

export const AccordionWrap = styled(Accordion)`
  text-align: left;
  background-color: inherit;
  & > div {
    padding: 20px 0 0;
    margin: 0;
  }
`

export const DelegatorsListItem = styled.div`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  &:not(:last-child) {
    border-bottom: 1px solid var(--lido-color-border);
  }
`

export const DelegatorsVotingPower = styled(Text).attrs({ size: 'xs' })`
  min-width: 100px;
  text-align: right;
`

export const AddressWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const ListWrap = styled.div`
  border: 1px solid var(--lido-color-border);
  margin: 0 -32px;
  border-radius: 8px;
`

export const VotedByHolderWrap = styled.div`
  margin: 24px -32px 12px;
`
