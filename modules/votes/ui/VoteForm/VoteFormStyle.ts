import styled from 'styled-components'

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
