import { Button } from '@lidofinance/lido-ui'
import styled from 'styled-components'

export const Wrap = styled.div<{ $empty?: boolean }>`
  border-radius: 20px;
  background-color: var(--lido-color-foreground);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  ${({ $empty }) =>
    $empty &&
    `
    padding: 80px 24px;
    text-align: center;
  `}
`

export const DeelgatorsListStyled = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid var(--lido-color-border);
`

export const ShowMoreButton = styled(Button).attrs({
  variant: 'text',
  size: 'sm',
})`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 11px;
  border-bottom-right-radius: 11px;
`

export const AddressBadgeWrap = styled.span`
  display: inline-flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  & > div:nth-child(1) {
    margin-right: 8px;
  }
`

export const DelegatorsListItem = styled.div`
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  &:not(:only-child) {
    border-bottom: 1px solid var(--lido-color-border);
  }
`