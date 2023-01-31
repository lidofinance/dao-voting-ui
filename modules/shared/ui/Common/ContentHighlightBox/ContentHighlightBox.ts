import styled from 'styled-components'

type BoxProps = {
  isCentered?: boolean
}

export const ContentHighlightBox = styled.div<BoxProps>`
  margin-bottom: 10px;
  padding: 10px;
  color: var(--lido-color-text);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs};
  font-weight: 400;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  text-align: ${({ isCentered }) => (isCentered ? 'center' : 'left')};
  background-color: var(--lido-color-backgroundSecondary);
`
