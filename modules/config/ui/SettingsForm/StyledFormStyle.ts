import styled from 'styled-components'

export const Actions = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`

export const DescriptionText = styled.div`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: 500;
  line-height: 1.5;

  & p:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  }

  & a {
    text-decoration: none;
    color: var(--lido-color-primary);
  }
`

export const DescriptionTitle = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  font-weight: 800;
  line-height: 1.5;
  color: var(--lido-color-text);

  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.spaceMap.md}px;
  }
`
