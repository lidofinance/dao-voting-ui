import styled, { css } from 'styled-components'

type WrapProps = {
  type: 'error' | 'warning'
}

export const Wrap = styled.div<WrapProps>`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 400;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;

  & svg {
    display: block;
    flex: 0 0 auto;
    margin-right: ${({ theme }) => theme.spaceMap.sm}px;
    fill: var(--lido-color-textDark);
  }

  ${({ type }) =>
    type === 'error' &&
    css`
      background-color: var(--lido-color-error);

      &,
      & a {
        color: var(--lido-color-errorContrast);
      }

      & svg {
        fill: var(--lido-color-errorContrast);
      }
    `}

  ${({ type }) =>
    type === 'warning' &&
    css`
      background-color: var(--lido-color-warningBackground);

      &,
      & a {
        color: var(--lido-color-textDark);
      }

      & svg {
        fill: var(--lido-color-textDark);
      }
    `}
`
