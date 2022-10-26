import styled from 'styled-components'
import { Text } from 'modules/shared/ui/Common/Text'

export const Desc = styled.div`
  padding: 20px 0;
  text-align: center;

  & > p:not(:last-child) {
    margin-bottom: 8px;
  }
`

export const ErrorMessage = styled.div`
  padding: 20px;
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
