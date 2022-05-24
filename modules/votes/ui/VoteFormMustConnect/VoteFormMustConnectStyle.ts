import styled from 'styled-components'

export const Connect = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`
