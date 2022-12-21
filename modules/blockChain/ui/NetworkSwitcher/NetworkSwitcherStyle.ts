import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  background-color: ${({ theme }) =>
    theme.name === 'light' ? '#fffae0' : theme.colors.warning};
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;

  & svg {
    display: block;
    flex: 0 0 auto;
    margin-right: ${({ theme }) => theme.spaceMap.sm}px;
    fill: ${({ theme }) => theme.colors.accentText};
  }
`
