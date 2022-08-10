import styled from 'styled-components'

export const ErrorMessage = styled.div`
  padding: 20px;
  color: #fff;
  background-color: ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;

  & a {
    color: #fff;
  }
`
