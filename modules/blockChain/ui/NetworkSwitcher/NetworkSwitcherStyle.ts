import styled from 'styled-components'

export const Wrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  color: #273852;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  background-color: #fffae0;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;

  & svg {
    display: block;
    flex: 0 0 auto;
    margin-right: ${({ theme }) => theme.spaceMap.sm}px;
    fill: #273852;
  }
`
