import styled from 'styled-components'

export const Wrap = styled.div`
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) =>
    theme.name === 'light' ? '#fffae0' : theme.colors.warning};
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;

  b {
    font-weight: 700;
  }

  p {
    &:not(:last-child) {
      margin-bottom: ${({ theme }) => theme.spaceMap.xs}px;
    }
  }

  &:empty {
    display: none;
  }
`
