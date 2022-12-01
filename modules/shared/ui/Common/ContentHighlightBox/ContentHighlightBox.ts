import styled from 'styled-components'

type BoxProps = {
  isCentered?: boolean
}

export const ContentHighlightBox = styled.div`
  margin-bottom: 10px;
  padding: 10px;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizesMap.xxs};
  font-weight: 400;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  text-align: ${({ isCentered }: BoxProps) => (isCentered ? 'center' : 'left')};
  background-color: ${({ theme }) => theme.colors.background};
`
