import styled from 'styled-components'
import { Button, Text } from '@lidofinance/lido-ui'

export const DelegationFormControllerStyled = styled.form<{
  $customMode: boolean
}>`
  display: flex;
  flex-direction: column;

  ${({ $customMode }) =>
    $customMode &&
    `
    padding: 24px 16px;
    background-color: var(--lido-color-accentControlBg);
    border-radius: 20px;
  `}
`

export const DelegationSubtitleStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`

export const DelegationFormBalanceStyled = styled.div<{ $withError: boolean }>`
  margin-top: ${({ $withError }) => ($withError ? '32px' : '12px')};
  display: flex;
  gap: 16px;
  justify-content: space-between;
`

export const Balance = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  & > p {
    font-size: 12px;

    &:first-child {
      opacity: 0.6;
    }
  }
`

export const CustomizeButton = styled(Button).attrs({
  variant: 'text',
  size: 'sm',
})`
  font-size: 12px;
  padding: 4px;
  min-width: auto;
`

export const SubmitButton = styled(Button)`
  margin-top: 16px;
`

export const DelegationFormFootNoteStyled = styled(Text).attrs({
  size: 'xxs',
  color: 'secondary',
})`
  margin-top: 8px;
`
