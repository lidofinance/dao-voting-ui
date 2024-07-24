import { ButtonIcon, Close, Text } from '@lidofinance/lido-ui'
import styled from 'styled-components'

export const StatusesWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`

export const DelegationStatusStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`

export const StatusWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export const StatusLabel = styled(Text).attrs({
  size: 'xxs',
})``

export const StatusValue = styled(Text).attrs({
  size: 'xxs',
  color: 'secondary',
})``

export const DelegationAddressBadgeStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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

export const RevokeDelegationButton = styled(ButtonIcon).attrs({
  icon: <Close />,
  color: 'secondary',
  variant: 'translucent',
  size: 'xs',
})`
  padding: 4px;
  color: var(--lido-color-textSecondary);
  flex-shrink: 0;
  border-radius: 50%;

  svg {
    width: 16px;
    height: 16px;
  }
`
export const ModalButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  & > button {
    flex: 1;
  }
`
