import styled from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'

export const Desc = styled.div`
  padding: ${({ theme }) => theme.spaceMap.lg}px 0;
  text-align: center;

  & > p:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  }
`

export const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;

  & a {
    color: #fff;
  }
`

export const ClearButton = styled(Text).attrs({
  size: 14,
  weight: 700,
  color: 'primary',
})`
  cursor: pointer;
`
